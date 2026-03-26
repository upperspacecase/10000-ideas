import { Instrument_Serif, Instrument_Sans } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
	weight: "400",
	subsets: ["latin"],
	variable: "--font-instrument-serif",
	display: "swap",
});

const instrumentSans = Instrument_Sans({
	subsets: ["latin"],
	variable: "--font-instrument-sans",
	display: "swap",
});

export const viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = {
	...getSEOTags({
		title: "10,000 IDEAS | Daily Project Launches",
		description: "An open-source venture studio launching one new project every day. Join a team, submit an idea, or just watch us build.",
	}),
	icons: {
		icon: "/dragon-hero.png",
		apple: "/dragon-hero.png",
	},
};

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-theme={config.colors.theme}
			className={`${instrumentSerif.variable} ${instrumentSans.variable}`}
		>
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
