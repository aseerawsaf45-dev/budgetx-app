import * as LZString from 'lz-string';
import { Tour, Expense, Contributor } from '../types';
import * as Crypto from 'expo-crypto';
import { Platform } from 'react-native';

export const CATEGORIES = [
  'Transport',
  'Hotel',
  'Food',
  'Snacks',
  'Tickets',
  'Guide',
  'Emergency',
  'Miscellaneous',
] as const;

export type CategoryType = typeof CATEGORIES[number];

// Compact format interface for minimal payload size:
// v: version (1)
// n: name
// d: destination
// l: days (length)
// c: array of contributor names
// e: array of [title, amount, day, categoryIdx, paidByMap, splitAmongIndices, details?, splitValuesMap?, givingSharesMap?]
interface CompactTourPayload {
  v: 1;
  n: string;
  d: string;
  l: number;
  c: string[];
  e: [
    string,                    // 0: title
    number,                    // 1: amount
    number,                    // 2: day
    number,                    // 3: category index
    Record<number, number>,    // 4: paidBy { contributorIndex: amount }
    number[],                  // 5: splitAmong [contributorIndex...] (empty = all)
    string?,                   // 6: details (optional)
    Record<number, number>?,   // 7: splitValuesMap { contributorIndex: cost }
    Record<number, number[]>?, // 8: givingSharesMap { payerIndex: [beneficiaryIndex...] }
  ][];
}

/**
 * Encodes a Tour into an ultra-compact LZString-compressed representation.
 */
export const encodeTourToCompact = (tour: Tour): string => {
  const contributorIdToIndex: Record<string, number> = {};
  const contributorNames: string[] = [];

  tour.contributors.forEach((c, idx) => {
    contributorIdToIndex[c.id] = idx;
    contributorNames.push(c.name);
  });

  const compactExpenses: CompactTourPayload['e'] = tour.expenses.map((exp) => {
    const catIndex = Math.max(0, CATEGORIES.indexOf(exp.category as any));
    
    // Map paidBy contributor IDs to small numerical indices
    const paidByMap: Record<number, number> = {};
    if (exp.paidBy) {
      Object.entries(exp.paidBy).forEach(([id, amt]) => {
        const idx = contributorIdToIndex[id];
        if (idx !== undefined) {
          paidByMap[idx] = amt;
        }
      });
    }

    // Map splitAmong contributor IDs to small numerical indices
    // If it splits equally among all contributors, store empty array to save bytes
    let splitIndices: number[] = [];
    if (Array.isArray(exp.splitAmong) && exp.splitAmong.length > 0) {
      if (exp.splitAmong.length !== tour.contributors.length) {
        splitIndices = exp.splitAmong
          .map((id) => contributorIdToIndex[id])
          .filter((idx): idx is number => idx !== undefined);
      }
    }

    const item: CompactTourPayload['e'][number] = [
      exp.title || 'Expense',
      exp.amount || 0,
      exp.day || 1,
      catIndex,
      paidByMap,
      splitIndices,
    ];

    if (exp.details && exp.details.trim()) {
      item.push(exp.details.trim());
    } else if (exp.splitValues || exp.givingShares) {
      item.push('');
    }

    if (exp.splitValues || exp.givingShares) {
      const splitValuesMap: Record<number, number> = {};
      if (exp.splitValues) {
        Object.entries(exp.splitValues).forEach(([id, amt]) => {
          const idx = contributorIdToIndex[id];
          if (idx !== undefined) {
            splitValuesMap[idx] = amt;
          }
        });
      }
      item.push(splitValuesMap);

      if (exp.givingShares) {
        const givingSharesMap: Record<number, number[]> = {};
        Object.entries(exp.givingShares).forEach(([payerId, bIds]) => {
          const pIdx = contributorIdToIndex[payerId];
          if (pIdx !== undefined) {
            givingSharesMap[pIdx] = (bIds || [])
              .map(id => contributorIdToIndex[id])
              .filter((idx): idx is number => idx !== undefined);
          }
        });
        item.push(givingSharesMap);
      }
    }

    return item;
  });

  const payload: CompactTourPayload = {
    v: 1,
    n: tour.name,
    d: tour.destination,
    l: tour.days || 1,
    c: contributorNames,
    e: compactExpenses,
  };

  return LZString.compressToEncodedURIComponent(JSON.stringify(payload));
};

/**
 * Decodes compressed tour data (supports both v1 compact format and legacy uncompressed/full formats).
 */
export const decodeTourData = (dataStr: string): Tour | null => {
  if (!dataStr) return null;

  let decodedStr: string | null = null;

  // 1. Try decompressing with LZString directly
  try {
    decodedStr = LZString.decompressFromEncodedURIComponent(dataStr);
  } catch (e) {
    decodedStr = null;
  }

  // 1b. If failed and dataStr contains spaces (URLSearchParams / copy-paste often converts '+' to ' '), restore '+'
  if (!decodedStr && dataStr.includes(' ')) {
    try {
      decodedStr = LZString.decompressFromEncodedURIComponent(dataStr.replace(/ /g, '+'));
    } catch (e) {
      decodedStr = null;
    }
  }

  // 1c. If dataStr was percent-encoded (e.g. %2B, %20), unescape and retry
  if (!decodedStr && dataStr.includes('%')) {
    try {
      const unescaped = decodeURIComponent(dataStr);
      decodedStr = LZString.decompressFromEncodedURIComponent(unescaped);
      if (!decodedStr && unescaped.includes(' ')) {
        decodedStr = LZString.decompressFromEncodedURIComponent(unescaped.replace(/ /g, '+'));
      }
    } catch (e) {
      decodedStr = null;
    }
  }

  // 2. Fallback to base64 or URI decode for older legacy links
  if (!decodedStr) {
    try {
      let b64Candidate = dataStr.trim().replace(/[\r\n\s]+/g, '');
      if (b64Candidate.includes('%')) {
        try {
          b64Candidate = decodeURIComponent(b64Candidate);
        } catch (e) {}
      }
      
      const rem = b64Candidate.length % 4;
      if (rem) {
        b64Candidate += '='.repeat(4 - rem);
      }

      if (Platform.OS === 'web' && typeof window !== 'undefined' && typeof window.atob === 'function') {
        try {
          const bin = window.atob(b64Candidate);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          decodedStr = new TextDecoder('utf-8').decode(bytes);
        } catch (e) {
          decodedStr = decodeURIComponent(dataStr);
        }
      } else if (typeof Buffer !== 'undefined') {
        decodedStr = Buffer.from(b64Candidate, 'base64').toString('utf8');
      } else {
        decodedStr = decodeURIComponent(dataStr);
      }
    } catch (e) {
      decodedStr = null;
    }
  }

  if (!decodedStr) return null;

  try {
    const parsed = JSON.parse(decodedStr);

    // Check if it's the v1 compact format
    if (parsed && parsed.v === 1) {
      const contributorNames: string[] = Array.isArray(parsed.c) ? parsed.c : [];
      const contributors: Contributor[] = contributorNames.map((name, idx) => ({
        id: `c_${idx}`,
        name: String(name),
      }));

      const rawExpenses: any[] = Array.isArray(parsed.e) ? parsed.e : [];
      const expenses: Expense[] = rawExpenses.map((row, expIdx) => {
        const title = row[0] || 'Expense';
        const amount = Number(row[1]) || 0;
        const day = Number(row[2]) || 1;
        const catIdx = Number(row[3]) || 0;
        const rawPaidBy = row[4] || {};
        const rawSplit = row[5] || [];
        const details = row[6] ? String(row[6]) : undefined;
        const rawSplitValues = row[7] || null;
        const rawGivingShares = row[8] || null;

        const paidBy: Record<string, number> = {};
        Object.entries(rawPaidBy).forEach(([idxStr, amt]) => {
          const cId = `c_${idxStr}`;
          paidBy[cId] = Number(amt);
        });

        let splitAmong: string[] = [];
        if (Array.isArray(rawSplit) && rawSplit.length > 0) {
          splitAmong = rawSplit.map((idx: any) => `c_${idx}`);
        } else {
          // Empty array indicates split among all contributors
          splitAmong = contributors.map((c) => c.id);
        }

        const splitValues: Record<string, number> = {};
        if (rawSplitValues && typeof rawSplitValues === 'object') {
          Object.entries(rawSplitValues).forEach(([idxStr, amt]) => {
            splitValues[`c_${idxStr}`] = Number(amt);
          });
        }

        const givingShares: Record<string, string[]> = {};
        if (rawGivingShares && typeof rawGivingShares === 'object') {
          Object.entries(rawGivingShares).forEach(([pIdxStr, bIndices]) => {
            if (Array.isArray(bIndices)) {
              givingShares[`c_${pIdxStr}`] = bIndices.map(bIdx => `c_${bIdx}`);
            }
          });
        }

        const splitType: Expense['splitType'] = Object.keys(givingShares).length > 0
          ? 'GIVING_SHARES'
          : Object.keys(splitValues).length > 0
            ? 'EXACT'
            : 'EQUAL';

        const category: CategoryType = CATEGORIES[catIdx] || 'Miscellaneous';

        return {
          id: `exp_${expIdx}`,
          tourId: 'shared_tour',
          title,
          details,
          amount,
          date: new Date().toISOString(),
          day,
          category,
          paidBy,
          splitAmong,
          splitType,
          splitValues: Object.keys(splitValues).length > 0 ? splitValues : undefined,
          givingShares: Object.keys(givingShares).length > 0 ? givingShares : undefined,
          paymentType: 'EXACT',
        };
      });

      return {
        id: 'shared_' + Date.now(),
        name: parsed.n || 'Shared Tour',
        destination: parsed.d || '',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        days: Number(parsed.l) || 1,
        estimatedParticipants: contributors.length,
        totalBudget: 0,
        contributors,
        expenses,
        createdAt: new Date().toISOString(),
      };
    }

    // Legacy format (full Tour JSON or alternative naming)
    if (parsed && typeof parsed === 'object' && (parsed.name || parsed.title)) {
      const tourName = parsed.name || parsed.title || 'Shared Tour';
      const rawContributors = parsed.contributors || parsed.participants || [];
      const contributors: Contributor[] = rawContributors.map((c: any, idx: number) => {
        if (typeof c === 'string') {
          return { id: `c_${idx}`, name: c };
        }
        return {
          id: c.id || `c_${idx}`,
          name: c.name || `Participant ${idx + 1}`,
        };
      });

      const rawExpenses = parsed.expenses || [];
      const expenses: Expense[] = rawExpenses.map((exp: any, idx: number) => {
        let paidBy: Record<string, number> = {};
        if (exp.paidBy && typeof exp.paidBy === 'object') {
          Object.entries(exp.paidBy).forEach(([k, v]) => {
            // If key is a participant name, find corresponding ID
            const matchingContributor = contributors.find(c => c.name === k || c.id === k);
            const key = matchingContributor ? matchingContributor.id : k;
            paidBy[key] = Number(v) || 0;
          });
        }

        let splitAmong: string[] = [];
        if (Array.isArray(exp.splitAmong) && exp.splitAmong.length > 0) {
          splitAmong = exp.splitAmong.map((item: any) => {
            const matchingContributor = contributors.find(c => c.name === item || c.id === item);
            return matchingContributor ? matchingContributor.id : String(item);
          });
        } else if (exp.splitAmounts && typeof exp.splitAmounts === 'object') {
          splitAmong = Object.keys(exp.splitAmounts).map((k) => {
            const matchingContributor = contributors.find(c => c.name === k || c.id === k);
            return matchingContributor ? matchingContributor.id : k;
          });
        } else {
          splitAmong = contributors.map(c => c.id);
        }

        return {
          id: exp.id || `exp_${idx}`,
          tourId: exp.tourId || 'shared_tour',
          title: exp.title || 'Expense',
          details: exp.details || undefined,
          amount: Number(exp.amount) || 0,
          date: exp.date || new Date().toISOString(),
          day: Number(exp.day) || 1,
          category: (exp.category as any) || 'Miscellaneous',
          paidBy,
          splitAmong,
          splitType: 'EQUAL',
          paymentType: exp.paymentType || 'EXACT',
        };
      });

      return {
        id: parsed.id || 'shared_' + Date.now(),
        name: tourName,
        destination: parsed.destination || '',
        startDate: parsed.startDate || new Date().toISOString(),
        endDate: parsed.endDate || new Date().toISOString(),
        days: Number(parsed.days) || 1,
        estimatedParticipants: contributors.length,
        totalBudget: Number(parsed.totalBudget) || 0,
        contributors,
        expenses,
        createdAt: parsed.createdAt || new Date().toISOString(),
      };
    }

    return null;
  } catch (err) {
    return null;
  }
};

export const PUBLIC_APP_URL = 'https://budgetx-app-nine.vercel.app';

/**
 * Returns true if an expense is an internal debt settlement between members,
 * rather than an actual trip cost.
 */
export const isSettlementExpense = (e: { title?: string; category?: string }): boolean => {
  if (!e) return false;
  return (e.title || '').trim().startsWith('Settlement:') || e.category === ('Settlement' as any);
};

/**
 * Returns a globally accessible base URL for sharing.
 * When running on localhost or private networks, defaults to the canonical public Vercel domain,
 * ensuring public shorteners (is.gd / v.gd) succeed and recipients can open the link.
 */
export const getShareableBaseUrl = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isPrivate =
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.endsWith('.local');
    if (!isPrivate && window.location.origin) {
      return window.location.origin;
    }
  }
  return PUBLIC_APP_URL;
};

/**
 * Attempts to shorten a URL using is.gd, then v.gd as fallback.
 * Both allow open CORS '*' requests from client browsers.
 */
export const shortenUrl = async (longUrl: string): Promise<string> => {
  // 1. Try is.gd (fast, CORS-enabled)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const endpoint = `https://is.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.shorturl) {
        return data.shorturl;
      }
    }
  } catch (err) {
    // Proceed to fallback
  }

  // 2. Try tinyurl fallback (global high reliability)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const endpoint = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const text = (await response.text()).trim();
      if (text.startsWith('http')) {
        return text;
      }
    }
  } catch (err) {
    // Proceed to fallback
  }

  // 3. Try v.gd fallback
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const endpoint = `https://v.gd/create.php?format=json&url=${encodeURIComponent(longUrl)}`;
    const response = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.shorturl) {
        return data.shorturl;
      }
    }
  } catch (err) {
    // Proceed to fallback
  }

  return longUrl;
};

/**
 * Parses a shared tour from a URL, link, or raw encoded data.
 * Supports short links (is.gd / tinyurl / v.gd), direct URLs, or raw data strings.
 */
export const resolveSharedTour = async (input: string): Promise<Tour | null> => {
  const trimmed = (input || '').trim();
  if (!trimmed) return null;

  // 1. If user pasted a direct compressed data string
  const directTour = decodeTourData(trimmed);
  if (directTour) return directTour;

  let targetUrl = trimmed;

  // 2. If it's a shortened link (is.gd / v.gd / tinyurl), follow redirect or expand
  if (targetUrl.includes('is.gd/') || targetUrl.includes('v.gd/')) {
    try {
      const lookupEndpoint = targetUrl.includes('is.gd/')
        ? `https://is.gd/forward.php?format=json&shorturl=${encodeURIComponent(targetUrl)}`
        : `https://v.gd/forward.php?format=json&shorturl=${encodeURIComponent(targetUrl)}`;
      
      const res = await fetch(lookupEndpoint);
      if (res.ok) {
        const json = await res.json();
        if (json && json.url) {
          targetUrl = json.url;
        }
      }
    } catch (e) {}
  } else if (targetUrl.includes('tinyurl.com/')) {
    try {
      const res = await fetch(targetUrl);
      if (res.ok && res.url) {
        targetUrl = res.url;
      }
    } catch (e) {}
  }

  // 3. Extract ?data= or &data= or #data= parameter from URL
  try {
    // Regex matching any data parameter format
    const match = targetUrl.match(/[?&#]data=([^&#\s]+)/);
    if (match && match[1]) {
      const decodedParam = decodeURIComponent(match[1]);
      const tourFromMatch = decodeTourData(decodedParam);
      if (tourFromMatch) return tourFromMatch;
    }

    const queryIdx = targetUrl.indexOf('?');
    if (queryIdx !== -1) {
      const query = targetUrl.substring(queryIdx + 1);
      const params = new URLSearchParams(query);
      const dataParam = params.get('data');
      if (dataParam) {
        const tour = decodeTourData(dataParam);
        if (tour) return tour;
      }
    }
  } catch (e) {
    // URL parsing failed
  }

  return null;
};
