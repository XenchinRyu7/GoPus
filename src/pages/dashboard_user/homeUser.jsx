import React, { useEffect, useState } from "react";
import banner from "@/../public/img/banner.svg";
import { PuspaSection } from "@/components/PuspaSection";
import { getProducts } from "@/api/product";
import { getToken } from "@/utils/auth";
import { useNavigate } from "react-router-dom";

const placeSections = [
	{
		place_id: 3,
		title: "Puspa Taman Kota",
		subtitle: "Aneka jajanan di Puspa Taman Kota",
	},
	{
		place_id: 1,
		title: "Puspa Siliwangi",
		subtitle: "Aneka jajanan di Puspa Siliwangi",
	},
	{
		place_id: 2,
		title: "Puspa Langlangbuana",
		subtitle: "Aneka jajanan di Puspa Langlangbuana",
	},
];

function getSafeImage(img) {
	if (!img) return undefined;
	if (img.includes("drive.google.com/open?id=")) {
		const id = img.split("id=")[1];
		return `https://drive.google.com/uc?export=view&id=${id}`;
	}
	if (img.includes("drive.google.com/file/d/")) {
		const match = img.match(/\/d\/([\w-]+)/);
		if (match && match[1]) {
			return `https://drive.google.com/uc?export=view&id=${match[1]}`;
		}
	}
	if (img.startsWith("/img/")) {
		return img;
	}
	return undefined;
}

export function HomeUser() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchProducts() {
			setLoading(true);
			try {
				const token = getToken();
				const res = await getProducts(token);
				setProducts(res.data || res);
			} catch {
				setProducts([]);
			} finally {
				setLoading(false);
			}
		}
		fetchProducts();
	}, []);

	// Group products by place_id
	const grouped = { 3: [], 1: [], 2: [] };
	products.forEach((p) => {
		if (p.merchant && grouped[p.merchant.place_id]) {
			grouped[p.merchant.place_id].push({
				...p,
				image:
					getSafeImage(p.image) ||
					getSafeImage(p.merchant?.image) ||
					"/img/default.jpg",
				seller: p.merchant?.name || p.seller,
				location: p.location,
				category: p.category,
				rating: p.rating,
				onClick: () => navigate(`/dashboard/product/${p.id}`),
			});
		}
	});

	return (
		<div className="mt-6">
			{/* Banner */}
			<div className="w-full flex justify-center mb-8">
				<img
					src={banner}
					alt="Banner"
					className="rounded-xl w-full max-h-56 object-cover"
				/>
			</div>
			{/* Puspa Sections */}
			{loading ? (
				<div className="text-center py-10 text-blue-gray-500">
					Loading products...
				</div>
			) : (
				placeSections.map((section) => (
					<PuspaSection
						key={section.place_id}
						title={section.title}
						subtitle={section.subtitle}
						data={grouped[section.place_id]}
					/>
				))
			)}
		</div>
	);
}

export default HomeUser;
