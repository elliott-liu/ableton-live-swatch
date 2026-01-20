import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlState<T extends Record<string, any>>(defaultState: T) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const state = useMemo(() => {
		const obj = { ...defaultState };

		Object.keys(defaultState).forEach((key) => {
			const val = searchParams.get(key);

			if (val === null) {
				(obj as any)[key] = defaultState[key];
				return;
			}

			const defaultVal = defaultState[key];

			if (typeof defaultVal === "boolean") {
				(obj as any)[key] = val === "true";
			} else if (Array.isArray(defaultVal)) {
				(obj as any)[key] = val ? val.split(",") : [];
			} else if (typeof defaultVal === "number") {
				(obj as any)[key] = Number(val);
			} else {
				(obj as any)[key] = val;
			}
		});

		return obj as T;
	}, [searchParams, defaultState]);

	const updateState = useCallback(
		(updates: Partial<T>) => {
			const params = new URLSearchParams(searchParams.toString());

			Object.entries(updates).forEach(([key, value]) => {
				const isDefault =
					JSON.stringify(value) === JSON.stringify(defaultState[key]);

				if (isDefault || (Array.isArray(value) && value.length === 0)) {
					params.delete(key);
				} else {
					params.set(
						key,
						Array.isArray(value) ? value.join(",") : String(value),
					);
				}
			});

			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[pathname, router, searchParams, defaultState],
	);

	return [state, updateState] as const;
}
