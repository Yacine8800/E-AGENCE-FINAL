"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const GREEN = "#56C1B5";
const RED = "#EC4F48";

// Interfaces pour les données de consommation
interface ConsumptionData {
  month: string;
  fullMonth: string;
  kWh: number;
  cost: number;
  isTop?: boolean; // Ajout de la propriété isTop optionnelle
}

interface ConsumptionBarChartProps {
  lastInvoice?: any;
}

// Fonction pour générer des données de consommation fictives basées sur la dernière facture
const generateConsumptionData = (lastInvoice: any): ConsumptionData[] => {
  // Si aucune facture n'est disponible, utiliser des données par défaut
  if (!lastInvoice) {
    return [
      { month: "Jan", fullMonth: "Janvier", kWh: 600, cost: 23000 },
      { month: "Mars", fullMonth: "Mars", kWh: 320, cost: 12000 },
      { month: "Mai", fullMonth: "Mai", kWh: 750, cost: 28000 },
      { month: "Juil", fullMonth: "Juillet", kWh: 500, cost: 19000 },
      { month: "Sep", fullMonth: "Septembre", kWh: 1000, cost: 38000 },
      { month: "Nov", fullMonth: "Novembre", kWh: 720, cost: 27000 },
    ];
  }

  // Extraire les données de la dernière facture
  const currentKWh = lastInvoice.kwhEnregistre || 0;
  const currentCost = lastInvoice.montantTotalARegler || 0;
  
  // Obtenir le mois et l'année actuels de la facture
  const invoiceDate = new Date(lastInvoice.dateFacture);
  const currentMonth = invoiceDate.getMonth();
  const currentYear = invoiceDate.getFullYear();
  
  // Mapping des mois (abréviation et nom complet)
  const monthsShort = ["Jan", "Fév", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
  const monthsFull = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
  
  // Générer des données pour les 6 derniers mois (en incluant le mois actuel)
  const historicalData: ConsumptionData[] = [];
  
  for (let i = 0; i < 6; i++) {
    // Calculer le mois (en remontant dans le temps)
    const monthIndex = (currentMonth - i + 12) % 12;
    const isCurrent = i === 0;
    
    // Pour le mois actuel, utiliser les données réelles
    // Pour les mois précédents, générer des valeurs pseudo-aléatoires basées sur la consommation actuelle
    const variation = isCurrent ? 1 : 0.7 + Math.random() * 0.6; // Entre 70% et 130% de la consommation actuelle
    const kWh = isCurrent ? currentKWh : Math.round(currentKWh * variation);
    const cost = isCurrent ? currentCost : Math.round(currentKWh * variation * (currentCost / currentKWh));
    
    historicalData.unshift({
      month: monthsShort[monthIndex],
      fullMonth: monthsFull[monthIndex],
      kWh: kWh,
      cost: cost
    });
  }
  
  return historicalData;
};

const CustomTooltip = ({ active, payload, coordinate }: any) => {
  if (active && payload && payload.length) {
    const kWh = payload[0].value;
    const cost = payload[0].payload.cost;
    const topValues = payload[0].payload.isTop;
    const borderColor = topValues ? RED : GREEN;

    const windowWidth =
      typeof window !== "undefined" ? window.innerWidth : 1000;
    const isLeftSide = coordinate && coordinate.x < windowWidth / 2;

    return (
      <div className="relative">
        {/* Point blanc avec bordure colorée */}
        <div
          className="absolute"
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "white",
            border: `2px solid ${borderColor}`,
            [isLeftSide ? "left" : "right"]: "-4px",
            top: "20px",
            zIndex: 10,
            boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          }}
        />

        <div
          className="bg-white p-3 rounded-[20px]"
          style={{
            background: "white",
            border: `2px solid ${borderColor}`,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
            borderRadius: "30px",
            padding: "8px 16px",
            minWidth: "150px",
          }}
        >
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-bold">
              {kWh}{" "}
              <span className="text-[14px] font-medium text-gray-600">kWh</span>
            </p>
            <p className="text-[16px] font-bold">
              {cost.toLocaleString()}{" "}
              <span className="text-[14px] font-medium text-gray-600">
                Fcfa
              </span>
            </p>
            <p className="text-[12px] text-gray-500">
              {payload[0].payload.fullMonth}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default function ConsumptionBarChart({ lastInvoice }: ConsumptionBarChartProps) {
  const [activeBarIndex, setActiveBarIndex] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ConsumptionData[]>([]);
  const [top3Values, setTop3Values] = useState<number[]>([]);

  useEffect(() => {
    // Générer des données basées sur la dernière facture
    const data = generateConsumptionData(lastInvoice);
    
    // Déterminer les consommations les plus élevées pour coloration
    const sortedData = [...data].sort((a, b) => b.kWh - a.kWh);
    const topValues = sortedData.slice(0, 1).map((item) => item.kWh);
    
    // Ajouter la propriété isTop pour faciliter la coloration
    const enhancedData = data.map(item => ({
      ...item,
      isTop: topValues.includes(item.kWh)
    }));
    
    setChartData(enhancedData);
    setTop3Values(topValues);
  }, [lastInvoice]);

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
          barGap={8}
          barSize={35}
          onMouseMove={(state) => {
            if (
              state &&
              state.isTooltipActive &&
              state.activeTooltipIndex !== undefined
            ) {
              setActiveBarIndex(state.activeTooltipIndex);
            } else {
              setActiveBarIndex(null);
            }
          }}
          onMouseLeave={() => setActiveBarIndex(null)}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F0F0F0"
          />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#666666" }}
            axisLine={{ stroke: "#E0E0E0" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: "#666666" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            content={(props) => <CustomTooltip {...props} />}
            cursor={{ fill: "rgba(0, 0, 0, 0.03)" }}
            position={{ y: -10 }}
          />
          <Bar dataKey="kWh" radius={[20, 20, 0, 0]}>
            {chartData.map((entry, index) => {
              const barColor = entry.isTop ? RED : GREEN;
              return <Cell key={`cell-${index}`} fill={barColor} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
