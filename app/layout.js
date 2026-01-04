import { Space_Grotesk, Inter } from "next/font/google";
import { getSEOTags } from "@/libs/seo";
import ClientLayout from "@/components/LayoutClient";
import config from "@/config";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	variable: "--font-sans"
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-mono"
});

export const viewport = {
	themeColor: config.colors.main,
	width: "device-width",
	initialScale: 1,
};

export const metadata = getSEOTags({
	title: "10,000 IDEAS | Daily Project Launches",
	description: "An open-source venture studio launching one new project every day. Join a team, submit an idea, or just watch us build.",
});

export default function RootLayout({ children }) {
	return (
		<html
			lang="en"
			data-theme={config.colors.theme}
			className={`${spaceGrotesk.variable} ${inter.variable}`}
		>
			<body>
				<ClientLayout>{children}</ClientLayout>
			</body>
		</html>
	);
}
