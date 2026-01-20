import { Suspense } from "react";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Swatch } from "@/components/Swatch";

export default function Page() {
	return (
		<main className="h-full w-full">
			<Suspense
				fallback={
					<div className="my-12 flex h-full w-full items-center justify-center py-12">
						<LoadingSpinner className="size-6" />
					</div>
				}
			>
				<Swatch />
			</Suspense>
		</main>
	);
}
