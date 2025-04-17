import React from "react";
import RadioSelect from "../elements/radioSelect";

interface InfoClientProps {
  endpoint: "mutation" | "reabonnement" | "branchement";
}

const InfoClient: React.FC<InfoClientProps> = ({ endpoint }) => {
  return (
    <div className="w-full flex flex-col space-y-10 px-10">
      {/* checkbox - affiché uniquement pour mutation */}
      {endpoint === "mutation" && <RadioSelect />}

      {/* input identifiant  */}
      <div className="w-full flex flex-col gap-2">
        <label htmlFor="identifiant" className="text-sm font-semibold">
          Identifiant {endpoint !== "branchement" && <span className="text-primary">*</span>}
        </label>

        <input
          type="text"
          placeholder="041590594000"
          required={endpoint !== "branchement"}
          className="w-full border border-[#EDEDED] rounded-lg p-3"
        />
      </div>

      {/* Afficher des informations spécifiques en fonction du type */}
      {/* {endpoint === "reabonnement" && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            Informations spécifiques au réabonnement
          </p>
        </div>
      )} */}
    </div>
  );
};

export default InfoClient;
