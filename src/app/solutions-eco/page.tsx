"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Breadcrumb from "../components/Breadcrumb";

// Données des produits
const products = [
  {
    id: 1,
    name: "Ampoule LED Économique",
    category: "Éclairage",
    description: "Cette ampoule LED à basse consommation permet de réduire significativement votre consommation d'électricité tout en offrant un éclairage optimal pour votre intérieur.",
    specs: {
      dimension: "Standard E27",
      puissance: "9W (équivalent 60W)",
      dureeVie: "15 000 heures",
      garantie: "2 ans",
    },
    price: 16500,
    image: "/economie/ampoule.png",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Ventilateur Éco-énergétique",
    category: "Climatisation",
    description: "Ventilateur à faible consommation qui offre une circulation d'air optimale avec une consommation d'énergie minimale. Idéal pour les journées chaudes.",
    specs: {
      dimension: "40 cm de diamètre",
      puissance: "45W",
      dureeVie: "5 ans en usage normal",
      garantie: "3 ans",
    },
    price: 35000,
    image: "/economie/ventilo.png",
    rating: 4.2,
  },
  {
    id: 3,
    name: "Réfrigérateur Classe A+++",
    category: "Électroménager",
    description: "Réfrigérateur à haute efficacité énergétique qui maintient vos aliments frais tout en consommant jusqu'à 60% moins d'électricité qu'un modèle standard.",
    specs: {
      dimension: "180 cm x 60 cm",
      puissance: "120 kWh/an",
      dureeVie: "10 ans",
      garantie: "5 ans",
    },
    price: 435000,
    image: "/economie/frigo.png",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Multiprise Intelligente",
    category: "Accessoires",
    description: "Multiprise avec système de coupure automatique qui élimine la consommation en veille de vos appareils. Parfaite pour votre bureau, salon ou chambre.",
    specs: {
      dimension: "30 cm de longueur",
      puissance: "3680W max",
      dureeVie: "8 ans",
      garantie: "2 ans",
    },
    price: 18500,
    image: "/economie/ralonge.png",
    rating: 4.3,
  },
];

// Fonction pour formater le prix en FCFA
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price);
};

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

// Composant de carte produit
const ProductCard = ({ product }: { product: typeof products[0] }) => {
  return (
    <Link href={`/solutions-eco/${product.id}`} className="bg-[#F5F7F4] rounded-3xl overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-md">
      <div className="relative p-8 flex items-center justify-center">
        <Image
          src={product.image}
          alt={product.name}
          width={200}
          height={200}
          className="object-contain h-48 w-48"
        />
      </div>
      <div className="px-6 pb-6 flex flex-col flex-grow">
        <div className="text-xs text-gray-500 mb-1">{product.category}</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="mb-3">
          <RatingStars rating={product.rating} />
        </div>
        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{product.description}</p>

        <div className="space-y-1 mb-4">
          <div className="flex">
            <span className="text-gray-500 w-24 text-xs">Dimension:</span>
            <span className="text-gray-700 text-xs">{product.specs.dimension}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-24 text-xs">Puissance:</span>
            <span className="text-gray-700 text-xs">{product.specs.puissance}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-24 text-xs">Durée de vie:</span>
            <span className="text-gray-700 text-xs">{product.specs.dureeVie}</span>
          </div>
          <div className="flex">
            <span className="text-gray-500 w-24 text-xs">Garantie:</span>
            <span className="text-gray-700 text-xs">{product.specs.garantie}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="text-2xl font-semibold text-gray-800">
            {formatPrice(product.price)} <span className="text-sm text-gray-500 align-top">FCFA</span>
          </div>
          <button className="p-3 bg-orange text-white rounded-full font-medium hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-md flex items-center justify-center" aria-label="Voir plus de détails">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

// Composant de barre de recherche
const SearchBar = ({ onSearch }: { onSearch: (term: string) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="relative mb-8">
      <input
        type="text"
        placeholder="Rechercher un produit..."
        className="w-full px-4 py-3 pl-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange"
        value={searchTerm}
        onChange={handleChange}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  );
};

// Composant de filtre de catégories
const CategoryFilter = ({
  categories,
  activeCategory,
  onSelect
}: {
  categories: string[],
  activeCategory: string | null,
  onSelect: (category: string | null) => void
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-3">Catégories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-full text-sm ${activeCategory === null
            ? "bg-orange text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`px-4 py-2 rounded-full text-sm ${activeCategory === category
              ? "bg-orange text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default function SolutionsEcoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Extraire toutes les catégories uniques
  const categories = [...new Set(products.map((product) => product.category))];

  // Filtrer les produits en fonction de la recherche et de la catégorie
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === null || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen w-[90%] mx-auto mt-14 flex flex-col">
      <header className="bg-gradient-to-br from-[#F5F5F5] rounded-[20px] to-[#F0F0F0] pt-16 pb-24 px-4 sm:px-6 md:px-8 relative">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="container mx-auto relative">

          <div className="mt-8 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-noir relative inline-block">
              Éco-Store
              <div className="absolute -bottom-3 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vert to-transparent"></div>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              Découvrez notre sélection de produits écologiques pour réduire votre consommation d'énergie
              et adopter un mode de vie plus durable et respectueux de l'environnement.
            </p>
          </div>
        </div>
      </header>

      {/* Bannière promotionnelle */}
      <div className="bg-gradient-to-r from-vert to-vert-600 text-white py-12 px-4 sm:px-6 md:px-8 rounded-2xl mt-8 mb-16 relative z-10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">Économisez 15% sur votre première commande</h2>
              <p className="text-white/90 max-w-xl">
                Utilisez le code <span className="font-semibold bg-white/20 px-2 py-1 rounded">ECO15</span> lors de votre règlement pour bénéficier de cette offre exclusive.
              </p>
            </div>
            <button className="bg-white text-vert hover:bg-gray-100 font-semibold px-8 py-3 rounded-full inline-flex items-center transition-colors">
              En profiter maintenant
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow bg-[#F9FAF8] py-16 px-4 sm:px-6 md:px-8 -mt-10">
        <div className="container mx-auto">
          <div className="lg:flex lg:gap-8">
            <div className="lg:w-1/4 mb-8 lg:mb-0">
              <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
                <SearchBar onSearch={setSearchTerm} />
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onSelect={setActiveCategory}
                />

                <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-100">
                  <h3 className="text-green-800 font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Conseil éco
                  </h3>
                  <p className="text-sm text-green-700">
                    Pour commander un article, contactez le service client via le numéro : <span className="font-semibold">179</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-3/4">
              {filteredProducts.length === 0 ? (
                <div className="bg-white p-8 rounded-xl text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Aucun produit trouvé</h3>
                  <p className="text-gray-500">Essayez d'autres termes de recherche ou catégories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="bg-white py-16 px-4 sm:px-6 md:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
            Pourquoi choisir nos produits éco-responsables ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-10">
            <div className="bg-[#F9FAF8] p-6 rounded-xl shadow-sm hover:shadow transition-all duration-300 border border-gray-100 hover:border-orange/20">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Économie d'énergie</h3>
              <p className="text-gray-600">Nos produits sont conçus pour réduire significativement votre consommation d'électricité</p>
            </div>
            <div className="bg-[#F9FAF8] p-6 rounded-xl shadow-sm hover:shadow transition-all duration-300 border border-gray-100 hover:border-orange/20">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Durabilité</h3>
              <p className="text-gray-600">Fabriqués avec des matériaux de qualité pour une durée de vie prolongée et moins de déchets</p>
            </div>
            <div className="bg-[#F9FAF8] p-6 rounded-xl shadow-sm hover:shadow transition-all duration-300 border border-gray-100 hover:border-orange/20">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Économies financières</h3>
              <p className="text-gray-600">Réalisez des économies sur vos factures d'électricité grâce à nos solutions innovantes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
