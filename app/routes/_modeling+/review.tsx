import type { Route } from "./+types/review";

import { useSearchParams } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
	return null;
}

export async function action({ request }: Route.ActionArgs) {
	return null;
}

export const meta: MetaFunction = () => {
	return [{ title: "" }];
};

export default function Page({ loaderData, actionData }: Route.ComponentProps) {
	const [searchParams] = useSearchParams();

	return <></>;
}
