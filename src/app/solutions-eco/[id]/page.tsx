"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// Données des produits (à terme, ces données devraient venir d'une API ou d'une base de données)
const products = [
    {
        id: 1,
        name: "Ampoule LED Économique",
        category: "Éclairage",
        description: "Cette ampoule LED à basse consommation permet de réduire significativement votre consommation d'électricité tout en offrant un éclairage optimal pour votre intérieur.",
        longDescription: "Notre ampoule LED économique offre une luminosité comparable à une ampoule traditionnelle de 60W tout en ne consommant que 9W d'électricité. Avec sa durée de vie exceptionnelle de 15 000 heures, vous n'aurez pas à vous préoccuper de la remplacer fréquemment. Sa technologie avancée assure un démarrage instantané sans scintillement, protégeant ainsi vos yeux. La lumière produite est douce et naturelle, créant une ambiance agréable dans votre espace de vie ou de travail. C'est un choix écoresponsable qui vous permettra de réaliser des économies substantielles sur vos factures d'électricité tout en réduisant votre empreinte carbone.",
        specs: {
            dimension: "Standard E27",
            puissance: "9W (équivalent 60W)",
            dureeVie: "15 000 heures",
            garantie: "2 ans",
            couleur: "Blanc chaud (2700K)",
            flux: "806 lumens",
            efficacite: "90 lm/W",
            indice: "IP20 (usage intérieur)"
        },
        price: 16500,
        oldPrice: 19000,
        image: "/economie/ampoule.png",
        gallery: ["/economie/ampoule.png"],
        rating: 4.5,
        stock: 42,
        related: [2, 4]
    },
    {
        id: 2,
        name: "Ventilateur Éco-énergétique",
        category: "Climatisation",
        description: "Ventilateur à faible consommation qui offre une circulation d'air optimale avec une consommation d'énergie minimale. Idéal pour les journées chaudes.",
        longDescription: "Notre ventilateur éco-énergétique est conçu pour maximiser la circulation d'air tout en minimisant la consommation électrique. Doté de pales aérodynamiques spécialement conçues et d'un moteur à haut rendement, il consomme jusqu'à 35% moins d'électricité qu'un modèle standard. Ses trois vitesses et son mode oscillation à 90° vous permettent de personnaliser le flux d'air selon vos besoins. Le fonctionnement silencieux (moins de 50dB) en fait un choix parfait pour les chambres à coucher. Sa conception robuste et élégante s'intègre harmonieusement dans tout intérieur, qu'il s'agisse d'un bureau ou d'un salon.",
        specs: {
            dimension: "40 cm de diamètre",
            puissance: "45W",
            dureeVie: "5 ans en usage normal",
            garantie: "3 ans",
            vitesses: "3 vitesses + mode oscillation",
            bruit: "Moins de 50dB",
            couleur: "Blanc / Argent",
            poids: "2,8 kg"
        },
        price: 35000,
        oldPrice: 42000,
        image: "/economie/ventilo.png",
        gallery: ["/economie/ventilo.png"],
        rating: 4.2,
        stock: 15,
        related: [3, 4]
    },
    {
        id: 3,
        name: "Réfrigérateur Classe A+++",
        category: "Électroménager",
        description: "Réfrigérateur à haute efficacité énergétique qui maintient vos aliments frais tout en consommant jusqu'à 60% moins d'électricité qu'un modèle standard.",
        longDescription: "Ce réfrigérateur de classe énergétique A+++ représente le summum de l'efficacité énergétique. Grâce à sa technologie avancée de compresseur inverter, il ajuste automatiquement sa puissance en fonction des besoins, réduisant ainsi la consommation d'électricité jusqu'à 60% par rapport aux modèles conventionnels. Son système de refroidissement multi-flux assure une température homogène dans tout l'appareil, prolongeant la fraîcheur de vos aliments. Le compartiment fraîcheur spécial préserve les vitamines et nutriments de vos fruits et légumes. Les étagères en verre trempé sont facilement ajustables et nettoyables. Le design No Frost élimine la corvée de dégivrage. Silencieux (seulement 38 dB), il ne perturbera pas votre tranquillité.",
        specs: {
            dimension: "180 cm x 60 cm",
            puissance: "120 kWh/an",
            dureeVie: "10 ans",
            garantie: "5 ans",
            volume: "297 litres (réfrigérateur) + 100 litres (congélateur)",
            bruit: "38 dB",
            couleur: "Inox anti-traces",
            technologie: "No Frost, Multi-flow"
        },
        price: 435000,
        oldPrice: 499000,
        image: "/economie/frigo.png",
        gallery: ["/economie/frigo.png"],
        rating: 4.8,
        stock: 7,
        related: [4, 2]
    },
    {
        id: 4,
        name: "Multiprise Intelligente",
        category: "Accessoires",
        description: "Multiprise avec système de coupure automatique qui élimine la consommation en veille de vos appareils. Parfaite pour votre bureau, salon ou chambre.",
        longDescription: "Notre multiprise intelligente révolutionne la gestion de l'énergie dans votre domicile. Équipée de 6 prises et 2 ports USB, elle détecte automatiquement quand vos appareils sont en veille et coupe l'alimentation pour éliminer la consommation fantôme, qui peut représenter jusqu'à 10% de votre facture d'électricité. La technologie de protection contre les surtensions préserve vos appareils électroniques des pics électriques. Via l'application mobile dédiée, vous pouvez contrôler chaque prise individuellement, créer des programmes d'allumage/extinction et suivre votre consommation en temps réel. Compatible avec les assistants vocaux comme Google Home et Amazon Alexa, cette multiprise s'intègre parfaitement dans un écosystème de maison intelligente.",
        specs: {
            dimension: "30 cm de longueur",
            puissance: "3680W max",
            dureeVie: "8 ans",
            garantie: "2 ans",
            prises: "6 prises + 2 ports USB",
            connectivite: "Wi-Fi, Bluetooth",
            compatibilite: "iOS, Android, Google Home, Alexa",
            securite: "Protection contre les surtensions"
        },
        price: 18500,
        oldPrice: 22000,
        image: "/economie/ralonge.png",
        gallery: ["/economie/ralonge.png"],
        rating: 4.3,
        stock: 23,
        related: [1, 3]
    },
];

// Composant pour afficher les étoiles de notation
const RatingStars = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    return (
        <div className="flex">
            {[...Array(5)].map((_, i) => (
                <span key={i}>
                    {i < fullStars ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ) : i === fullStars && hasHalfStar ? (
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <defs>
                                <linearGradient id={`half-star-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="50%" stopColor="currentColor" />
                                    <stop offset="50%" stopColor="#D1D5DB" />
                                </linearGradient>
                            </defs>
                            <path fill={`url(#half-star-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    )}
                </span>
            ))}
        </div>
    );
};

// Fonction pour formater le prix en FCFA
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price);
};

// Composant de carte produit (version simplifiée pour les produits liés)
const ProductCardMini = ({ product }: { product: typeof products[0] }) => {
    return (
        <Link href={`/solutions-eco/${product.id}`}>
            <div className="bg-white rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md border border-gray-100 hover:border-orange/30">
                <div className="relative p-4 flex items-center justify-center">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={120}
                        height={120}
                        className="object-contain h-32 w-32"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="mt-auto">
                        <div className="text-lg font-semibold text-gray-800">
                            {formatPrice(product.price)} <span className="text-xs text-gray-500">FCFA</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Composant principal de la page de détail produit
export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [currentImage, setCurrentImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');

    // Récupérer l'ID du produit à partir des paramètres d'URL
    const productId = Number(params.id);

    // Trouver le produit correspondant
    const product = products.find(p => p.id === productId);

    // Si le produit n'existe pas, rediriger vers la page des produits
    if (!product) {
        if (typeof window !== 'undefined') {
            router.push('/solutions-eco');
        }
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    // Produits liés
    const relatedProducts = product.related.map(id => products.find(p => p.id === id)).filter(Boolean) as typeof products;

    return (
        <div className="min-h-screen w-[90%] mx-auto mt-14 flex flex-col">
            {/* Retour à la liste des produits */}
            <div className="mb-6">
                <Link href="/solutions-eco" className="text-gray-600 hover:text-orange flex items-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Retour à la boutique
                </Link>
            </div>

            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Partie gauche: Image du produit */}
                    <div>
                        <div className="bg-[#F5F7F4] rounded-xl p-8 flex items-center justify-center mb-4">
                            <Image
                                src={product.gallery[currentImage]}
                                alt={product.name}
                                width={400}
                                height={400}
                                className="object-contain max-h-80"
                            />
                        </div>

                        {/* Galerie d'images (miniatures) */}
                        {product.gallery.length > 1 && (
                            <div className="flex gap-2 mt-4">
                                {product.gallery.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImage(index)}
                                        className={`border-2 rounded-lg overflow-hidden ${currentImage === index ? "border-orange" : "border-gray-200"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.name} - vue ${index + 1}`}
                                            width={80}
                                            height={80}
                                            className="object-cover w-16 h-16"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Partie droite: Informations sur le produit */}
                    <div className="flex flex-col">
                        <span className="text-sm text-gray-500 mb-1">{product.category}</span>
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-4">
                            <RatingStars rating={product.rating} />
                            <span className="text-sm text-gray-500">
                                {product.rating.toFixed(1)} sur 5
                            </span>
                        </div>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-gray-900">
                                {formatPrice(product.price)} FCFA
                            </span>
                            {product.oldPrice && (
                                <span className="text-lg text-gray-500 line-through">
                                    {formatPrice(product.oldPrice)} FCFA
                                </span>
                            )}
                        </div>

                        <p className="text-gray-600 mb-8">{product.description}</p>
                    </div>
                </div>

                {/* Onglets d'information détaillée */}
                <div className="mt-12">
                    <div className="border-b border-gray-200">
                        <div className="flex flex-wrap -mb-px">
                            <button
                                className={`inline-block py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'description'
                                    ? 'border-orange text-orange'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setActiveTab('description')}
                            >
                                Description détaillée
                            </button>
                            <button
                                className={`inline-block py-4 px-6 border-b-2 font-medium text-sm ${activeTab === 'specifications'
                                    ? 'border-orange text-orange'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                onClick={() => setActiveTab('specifications')}
                            >
                                Caractéristiques techniques
                            </button>
                        </div>
                    </div>

                    <div className="py-6">
                        {activeTab === 'description' && (
                            <div className="prose max-w-none">
                                <p className="text-gray-700 leading-relaxed">{product.longDescription}</p>
                            </div>
                        )}

                        {activeTab === 'specifications' && (
                            <div className="bg-gray-50 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <tbody className="divide-y divide-gray-200">
                                        {Object.entries(product.specs).map(([key, value]) => (
                                            <tr key={key}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                                                    {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Produits liés */}
            {relatedProducts.length > 0 && (
                <div className="mt-16 mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Produits complémentaires</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((relatedProduct) => (
                            <ProductCardMini key={relatedProduct.id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 