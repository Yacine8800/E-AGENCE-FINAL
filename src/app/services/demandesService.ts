import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { API_URL } from "../config/constants";

// Types pour les demandes de mutation
export interface IdCardInfo {
  number: string;
  establishment_country: string;
  establishment_place: string;
  establishment_date: string;
  additionalProp1?: any;
}

export interface PersonInfo {
  firstname: string;
  lastname: string;
  email: string;
  mobile_number: string;
  id_card_number: string;
  id_card: IdCardInfo;
  additionalProp1?: any;
}

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  additionalProp1?: any;
}

export interface LocationInfo {
  address: string;
  city: string;
  postal_code: string;
  gps_coordinates: GpsCoordinates;
  additionalProp1?: any;
}

export interface MutationInfo {
  reason: string;
  details: string;
  mutation_date: string;
  additionalProp1?: any;
}

export interface RequestInfo {
  country: string;
  connection_index: number;
  subscription_number: string;
  counter_number: string;
  old_index: number;
  demand_number: string;
  additionalProp1?: any;
}

export interface Attachments {
  new_owner_id_card: string;
  current_owner_id_card: string;
  additional_documents: string[];
  additionalProp1?: any;
}

export interface MutationRequestBody {
  request_info: RequestInfo;
  current_owner: PersonInfo;
  new_owner: PersonInfo;
  location_info: LocationInfo;
  mutation_info: MutationInfo;
  attachments: Attachments;
  additionalProp1?: any;
}

export interface MutationFormData {
  requestInfo: Partial<RequestInfo>;
  currentOwner: Partial<PersonInfo>;
  newOwner: Partial<PersonInfo>;
  locationInfo: Partial<LocationInfo>;
  mutationInfo: Partial<MutationInfo>;
  attachments: {
    newOwnerIdCard: File | null;
    currentOwnerIdCard: File | null;
    additionalDocuments: File[];
  };
}

// Types pour le branchement abonnement
export interface BranchementRequestInfo {
  client_id: string;
  country: string;
  connection_index: number;
  counter_number: string;
  status: string;
  demand_number: string;
  additionalProp1?: any;
}

export interface OwnerInfo {
  firstname: string;
  lastname: string;
  reference: string;
  identifier: string;
  email: string;
  mobile_number: string;
  id_card: {
    number: string;
    establishment_place: string;
    establishment_date: string;
    attachment: string;
    additionalProp1?: any;
  };
  additionalProp1?: any;
}

export interface PersonalInfo {
  owner: OwnerInfo;
  notification_preferences: {
    email: string;
    mobile_number: string;
    additionalProp1?: any;
  };
  additionalProp1?: any;
}

export interface TechnicalInfo {
  branching_type: string; // monophasé, triphasé
  electricity_use: string; // domestique, professionnel, industriel
  subscription_type: string;
  power_subscription: string;
  circuit_breaker_settings: string; // chaud, froid
  additionalProp1?: any;
}

export interface BranchementAttachments {
  securel: string;
  official_request: string;
  leaseholder_id_card: string;
  additionalProp1?: any;
}

export interface BranchementRequestBody {
  request_info: BranchementRequestInfo;
  personal_info: PersonalInfo;
  technical_info: TechnicalInfo;
  attachments: BranchementAttachments;
  additionalProp1?: any;
}

export interface BranchementFormData {
  requestInfo: Partial<BranchementRequestInfo>;
  personalInfo: {
    owner: Partial<OwnerInfo>;
    notificationPreferences: {
      email: string;
      mobile_number: string;
    };
  };
  technicalInfo: Partial<TechnicalInfo>;
  attachments: {
    securel: File | null;
    official_request: File | null;
    leaseholder_id_card: File | null;
    additionalDocuments: File[];
  };
}

// Types pour les abonnements
export interface AbonnementRequestInfo {
  client_id: string;
  country: string;
  status: string;
  demand_number: string;
  codexp: string;
  additionalProp1?: any;
}

export interface IdCardAbonnement {
  number: string;
  establishment_place: string;
  establishment_date: string;
  attachment: string;
  additionalProp1?: any;
}

export interface PersonAbonnement {
  firstname: string;
  lastname: string;
  reference: string;
  identifier: string;
  email: string;
  mobile_number: string;
  phone_number: string;
  job: string;
  employer: string;
  service: string;
  job_id: string;
  address: string;
  id_card: IdCardAbonnement;
  additionalProp1?: any;
}

export interface AbonnementPersonalInfo {
  owner: PersonAbonnement;
  leaseholder: PersonAbonnement;
  additionalProp1?: any;
}

export interface AbonnementLocationInfo {
  suburb: string;
  section: string;
  management_center: string;
  boulevard: string;
  avenue: string;
  street: string;
  next_to: string;
  house_number: string;
  apartment: string;
  common_courtyard: string;
  building: string;
  additionalProp1?: any;
}

export interface AbonnementTechnicalInfo {
  branching_type: string;
  electricity_use: string;
  subscription_type: string;
  subscriber_type: string;
  circuit_breaker_settings: string;
  counter_number: string;
  connection_index: string;
  equipment_type: string;
  price_code: string;
  circuit_breaker_grade: string;
  pole_number: string;
  additionalProp1?: any;
}

export interface AbonnementAttachments {
  securel: string;
  receipt: string;
  owner_id_card: string;
  leaseholder_id_card: string;
  official_request_attachment: string;
  additionalProp1?: any;
}

export interface AbonnementNotify {
  email: string;
  mobile_number: string;
  additionalProp1?: any;
}

export interface AbonnementRequestBody {
  request_info: AbonnementRequestInfo;
  personal_info: AbonnementPersonalInfo;
  location_info: AbonnementLocationInfo;
  technical_info: AbonnementTechnicalInfo;
  attachments: AbonnementAttachments;
  notify: AbonnementNotify;
  additionalProp1?: any;
}

export interface AbonnementFormData {
  requestInfo: Partial<AbonnementRequestInfo>;
  personalInfo: {
    owner: Partial<PersonAbonnement>;
    leaseholder: Partial<PersonAbonnement>;
  };
  locationInfo: Partial<AbonnementLocationInfo>;
  technicalInfo: Partial<AbonnementTechnicalInfo>;
  attachments: {
    securel: File | null;
    receipt: File | null;
    owner_id_card: File | null;
    leaseholder_id_card: File | null;
    official_request_attachment: File | null;
    additionalDocuments: File[];
  };
  notify: Partial<AbonnementNotify>;
}

// Types pour les résiliations
export interface ResiliationRequestInfo {
  client_id: string;
  subscription_number: string;
  counter_number: string;
  demand_number: string;
  additionalProp1?: any;
}

export interface ResiliationPersonalInfo {
  firstname: string;
  lastname: string;
  reference: string;
  identifier: string;
  email: string;
  phone_number: string;
  mobile_number: string;
  additionalProp1?: any;
}

export interface ResiliationReferenceContact {
  firstname: string;
  lastname: string;
  mobile_number: string;
  additionalProp1?: any;
}

export interface ResiliationLocationInfo {
  suburb: string;
  section: string;
  subsection: string;
  operational_code: string;
  boulevard: string;
  avenue: string;
  street: string;
  next_to: string;
  country: string;
  counter_number: string;
  management_center: string;
  additionalProp1?: any;
}

export interface ResiliationTechnicalInfo {
  bill_reception_way: string;
  circuit_breaker_settings: string;
  electricity_usage: string;
  branching_type: string;
  equipment_type: string;
  subscriber_gender: string;
  price_code: string;
  additionalProp1?: any;
}

export interface ResiliationKennelKeeper {
  firstname: string;
  lastname: string;
  mobile_number: string;
}

export interface ResiliationTerminationInfo {
  cause: string;
  concern: string;
  kennel: string;
  kennel_closed: string;
  kennel_keeper: ResiliationKennelKeeper;
  additionalProp1?: any;
}

export interface ResiliationSettings {
  subscription_type: string;
  subscriber_type: string;
  additionalProp1?: any;
}

export interface ResiliationAttachments {
  id_card: string;
  additionalProp1?: any;
}

export interface ResiliationRequestBody {
  request_info: ResiliationRequestInfo;
  personal_info: ResiliationPersonalInfo;
  reference_contact: ResiliationReferenceContact;
  location_info: ResiliationLocationInfo;
  technical_info: ResiliationTechnicalInfo;
  termination_info: ResiliationTerminationInfo;
  settings: ResiliationSettings;
  attachments: ResiliationAttachments;
  additionalProp1?: any;
}

export interface ResiliationFormData {
  requestInfo: Partial<ResiliationRequestInfo>;
  personalInfo: Partial<ResiliationPersonalInfo>;
  referenceContact: Partial<ResiliationReferenceContact>;
  locationInfo: Partial<ResiliationLocationInfo>;
  technicalInfo: Partial<ResiliationTechnicalInfo>;
  terminationInfo: {
    cause: string;
    concern: string;
    kennel: string;
    kennel_closed: string;
    kennelKeeper: {
      firstname: string;
      lastname: string;
      mobile_number: string;
    };
  };
  settings: Partial<ResiliationSettings>;
  attachments: {
    id_card: File | null;
    additionalDocuments: File[];
  };
}

// Types pour les achats de disjoncteurs
export interface DisjoncteurRequestInfo {
  client_id: string;
  country: string;
  counter_number: string;
  codexp: string;
}

export interface DisjoncteurPersonalInfo {
  client_firstname: string;
  client_lastname: string;
  client_reference: string;
  client_identifier: string;
  client_mobile_number: string;
  client_phone_number: string;
}

export interface DisjoncteurTechnicalInfo {
  branching_type: string;
  electricity_use: string;
  equipment_type: string;
  price_code: string;
  circuit_breaker_settings: string;
  circuit_breaker_grade: string;
}

export interface DisjoncteurRequestBody {
  request_info: DisjoncteurRequestInfo;
  personal_info: DisjoncteurPersonalInfo;
  technical_info: DisjoncteurTechnicalInfo;
}

export interface DisjoncteurFormData {
  requestInfo: Partial<DisjoncteurRequestInfo>;
  personalInfo: Partial<DisjoncteurPersonalInfo>;
  technicalInfo: Partial<DisjoncteurTechnicalInfo>;
}

// Fonction pour convertir les fichiers en base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Retirer le préfixe "data:image/jpeg;base64," pour n'obtenir que la chaîne base64
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

// Fonction pour extraire les messages d'erreur de l'API
const extractErrorMessage = (error: AxiosError): string => {
  if (error.response) {
    // La requête a été faite et le serveur a répondu avec un code d'état en dehors de la plage 2xx
    const data = error.response.data as any;

    // Format d'erreur spécifique avec success, error, et details
    if (data.success === false && data.error) {
      let errorMessage = data.error.message || "Erreur de validation";

      // Ajouter les détails des erreurs s'ils existent
      if (
        data.error.details &&
        Array.isArray(data.error.details) &&
        data.error.details.length > 0
      ) {
        const detailsMessages = data.error.details
          .map((detail: any) => {
            if (detail.field && detail.message) {
              return `${detail.field}: ${detail.message}`;
            }
            return detail.message || "";
          })
          .filter(Boolean);

        if (detailsMessages.length > 0) {
          errorMessage += "\n• " + detailsMessages.join("\n• ");
        }
      }

      return errorMessage;
    }

    // Autres formats d'erreur
    if (data.message) {
      return data.message;
    } else if (data.error && typeof data.error === "string") {
      return data.error;
    } else if (typeof data === "string") {
      return data;
    }

    // Si aucun message d'erreur n'est trouvé, utiliser le code de statut
    return `Erreur ${error.response.status}: ${error.response.statusText}`;
  } else if (error.request) {
    // La requête a été faite mais aucune réponse n'a été reçue
    return "Aucune réponse reçue du serveur. Veuillez vérifier votre connexion.";
  } else {
    // Une erreur s'est produite lors de la configuration de la requête
    return error.message || "Une erreur inconnue s'est produite.";
  }
};

// Créer un client Axios configuré
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter un intercepteur pour gérer l'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Service pour les demandes de mutation
const demandesService = {
  // Soumettre une demande de mutation
  submitMutation: async (formData: MutationFormData): Promise<any> => {
    try {
      // Convertir les fichiers en base64
      const attachmentsBase64: Attachments = {
        new_owner_id_card: formData.attachments.newOwnerIdCard
          ? await fileToBase64(formData.attachments.newOwnerIdCard)
          : "",
        current_owner_id_card: formData.attachments.currentOwnerIdCard
          ? await fileToBase64(formData.attachments.currentOwnerIdCard)
          : "",
        additional_documents: await Promise.all(
          formData.attachments.additionalDocuments.map(fileToBase64)
        ),
        additionalProp1: {},
      };

      // Construire le corps de la requête
      const requestBody: MutationRequestBody = {
        request_info: {
          country: formData.requestInfo.country || "",
          connection_index: formData.requestInfo.connection_index || 0,
          subscription_number: formData.requestInfo.subscription_number || "",
          counter_number: formData.requestInfo.counter_number || "",
          old_index: formData.requestInfo.old_index || 0,
          demand_number: formData.requestInfo.demand_number || "",
          additionalProp1: {},
        },
        current_owner: {
          firstname: formData.currentOwner.firstname || "",
          lastname: formData.currentOwner.lastname || "",
          email: formData.currentOwner.email || "",
          mobile_number: formData.currentOwner.mobile_number || "",
          id_card_number: formData.currentOwner.id_card_number || "",
          id_card: {
            number: formData.currentOwner.id_card?.number || "",
            establishment_country:
              formData.currentOwner.id_card?.establishment_country || "",
            establishment_place:
              formData.currentOwner.id_card?.establishment_place || "",
            establishment_date:
              formData.currentOwner.id_card?.establishment_date || "",
            additionalProp1: {},
          },
          additionalProp1: {},
        },
        new_owner: {
          firstname: formData.newOwner.firstname || "",
          lastname: formData.newOwner.lastname || "",
          email: formData.newOwner.email || "",
          mobile_number: formData.newOwner.mobile_number || "",
          id_card_number: formData.newOwner.id_card_number || "",
          id_card: {
            number: formData.newOwner.id_card?.number || "",
            establishment_country:
              formData.newOwner.id_card?.establishment_country || "",
            establishment_place:
              formData.newOwner.id_card?.establishment_place || "",
            establishment_date:
              formData.newOwner.id_card?.establishment_date || "",
            additionalProp1: {},
          },
          additionalProp1: {},
        },
        location_info: {
          address: formData.locationInfo.address || "",
          city: formData.locationInfo.city || "",
          postal_code: formData.locationInfo.postal_code || "",
          gps_coordinates: {
            latitude: formData.locationInfo.gps_coordinates?.latitude || 0,
            longitude: formData.locationInfo.gps_coordinates?.longitude || 0,
            additionalProp1: {},
          },
          additionalProp1: {},
        },
        mutation_info: {
          reason: formData.mutationInfo.reason || "",
          details: formData.mutationInfo.details || "",
          mutation_date: formData.mutationInfo.mutation_date || "",
          additionalProp1: {},
        },
        attachments: attachmentsBase64,
        additionalProp1: {},
      };

      // Envoyer la requête
      const response = await apiClient.post(
        "/v3/demands/mutations/",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande de mutation:",
        error
      );

      const errorMessage =
        error instanceof AxiosError
          ? extractErrorMessage(error)
          : "Erreur lors de la soumission de la demande";

      // Ajouter l'erreur détaillée à l'objet d'erreur pour qu'elle soit accessible
      if (error instanceof Error) {
        error.message = errorMessage;
      }

      throw error;
    }
  },

  // Soumettre une demande de branchement abonnement
  submitBranchementAbonnement: async (
    formData: BranchementFormData
  ): Promise<any> => {
    try {
      // Valider que le document Securel est présent
      if (!formData.attachments.securel) {
        throw new Error(
          "Le document SECUREL (certificat technique) est obligatoire"
        );
      }

      // Convertir les fichiers en base64
      const attachmentsBase64: BranchementAttachments = {
        securel: formData.attachments.securel
          ? await JSON.stringify(formData.attachments.securel)
          : "",
        official_request: formData.attachments.official_request
          ? await fileToBase64(formData.attachments.official_request)
          : "",
        leaseholder_id_card: formData.attachments.leaseholder_id_card
          ? await fileToBase64(formData.attachments.leaseholder_id_card)
          : "",
        additionalProp1: {},
      };

      // Construire le corps de la requête
      const requestBody: BranchementRequestBody = {
        request_info: {
          client_id: formData.requestInfo.client_id || "",
          country: formData.requestInfo.country || "",
          connection_index: formData.requestInfo.connection_index || 0,
          counter_number: formData.requestInfo.counter_number || "",
          status: formData.requestInfo.status || "PENDING",
          demand_number: formData.requestInfo.demand_number || "",
          additionalProp1: {},
        },
        personal_info: {
          owner: {
            firstname: formData.personalInfo.owner.firstname || "",
            lastname: formData.personalInfo.owner.lastname || "",
            reference: formData.personalInfo.owner.reference || "",
            identifier: formData.personalInfo.owner.identifier || "",
            email: formData.personalInfo.owner.email || "",
            mobile_number: formData.personalInfo.owner.mobile_number || "",
            id_card: {
              number: formData.personalInfo.owner.id_card?.number || "",
              establishment_place:
                formData.personalInfo.owner.id_card?.establishment_place || "",
              establishment_date:
                formData.personalInfo.owner.id_card?.establishment_date || "",
              attachment: "",
              additionalProp1: {},
            },
            additionalProp1: {},
          },
          notification_preferences: {
            email: formData.personalInfo.notificationPreferences.email || "",
            mobile_number:
              formData.personalInfo.notificationPreferences.mobile_number || "",
            additionalProp1: {},
          },
          additionalProp1: {},
        },
        technical_info: {
          branching_type: formData.technicalInfo.branching_type || "",
          electricity_use: formData.technicalInfo.electricity_use || "",
          subscription_type: formData.technicalInfo.subscription_type || "0",
          power_subscription: formData.technicalInfo.power_subscription || "",
          circuit_breaker_settings:
            formData.technicalInfo.circuit_breaker_settings || "",
          additionalProp1: {},
        },
        attachments: attachmentsBase64,
        additionalProp1: {},
      };

      // Envoyer la requête
      const response = await apiClient.post(
        "/v3/demands/branchement_abonnements/",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande de branchement abonnement:",
        error
      );

      const errorMessage =
        error instanceof AxiosError
          ? extractErrorMessage(error)
          : "Erreur lors de la soumission de la demande";

      // Ajouter l'erreur détaillée à l'objet d'erreur pour qu'elle soit accessible
      if (error instanceof Error) {
        error.message = errorMessage;
      }

      throw error;
    }
  },

  // Soumettre une demande d'abonnement
  submitAbonnement: async (formData: AbonnementFormData): Promise<any> => {
    try {
      // Convertir les fichiers en base64
      const attachmentsBase64: AbonnementAttachments = {
        securel: formData.attachments.securel
          ? await fileToBase64(formData.attachments.securel)
          : "",
        receipt: formData.attachments.receipt
          ? await fileToBase64(formData.attachments.receipt)
          : "",
        owner_id_card: formData.attachments.owner_id_card
          ? await fileToBase64(formData.attachments.owner_id_card)
          : "",
        leaseholder_id_card: formData.attachments.leaseholder_id_card
          ? await fileToBase64(formData.attachments.leaseholder_id_card)
          : "",
        official_request_attachment: formData.attachments
          .official_request_attachment
          ? await fileToBase64(formData.attachments.official_request_attachment)
          : "",
        additionalProp1: {},
      };

      // Construire le corps de la requête
      const requestBody: AbonnementRequestBody = {
        request_info: {
          client_id: formData.requestInfo.client_id || "",
          country: formData.requestInfo.country || "",
          status: formData.requestInfo.status || "PENDING",
          demand_number: formData.requestInfo.demand_number || "",
          codexp: formData.requestInfo.codexp || "",
          additionalProp1: {},
        },
        personal_info: {
          owner: {
            firstname: formData.personalInfo.owner.firstname || "",
            lastname: formData.personalInfo.owner.lastname || "",
            reference: formData.personalInfo.owner.reference || "",
            identifier: formData.personalInfo.owner.identifier || "",
            email: formData.personalInfo.owner.email || "",
            mobile_number: formData.personalInfo.owner.mobile_number || "",
            phone_number: formData.personalInfo.owner.phone_number || "",
            job: formData.personalInfo.owner.job || "",
            employer: formData.personalInfo.owner.employer || "",
            service: formData.personalInfo.owner.service || "",
            job_id: formData.personalInfo.owner.job_id || "",
            address: formData.personalInfo.owner.address || "",
            id_card: {
              number: formData.personalInfo.owner.id_card?.number || "",
              establishment_place:
                formData.personalInfo.owner.id_card?.establishment_place || "",
              establishment_date:
                formData.personalInfo.owner.id_card?.establishment_date || "",
              attachment: "",
              additionalProp1: {},
            },
            additionalProp1: {},
          },
          leaseholder: {
            firstname: formData.personalInfo.leaseholder?.firstname || "",
            lastname: formData.personalInfo.leaseholder?.lastname || "",
            reference: formData.personalInfo.leaseholder?.reference || "",
            identifier: formData.personalInfo.leaseholder?.identifier || "",
            email: formData.personalInfo.leaseholder?.email || "",
            mobile_number:
              formData.personalInfo.leaseholder?.mobile_number || "",
            phone_number: formData.personalInfo.leaseholder?.phone_number || "",
            job: formData.personalInfo.leaseholder?.job || "",
            employer: formData.personalInfo.leaseholder?.employer || "",
            service: formData.personalInfo.leaseholder?.service || "",
            job_id: formData.personalInfo.leaseholder?.job_id || "",
            address: formData.personalInfo.leaseholder?.address || "",
            id_card: {
              number: formData.personalInfo.leaseholder?.id_card?.number || "",
              establishment_place:
                formData.personalInfo.leaseholder?.id_card
                  ?.establishment_place || "",
              establishment_date:
                formData.personalInfo.leaseholder?.id_card
                  ?.establishment_date || "",
              attachment: "",
              additionalProp1: {},
            },
            additionalProp1: {},
          },
          additionalProp1: {},
        },
        location_info: {
          suburb: formData.locationInfo.suburb || "",
          section: formData.locationInfo.section || "",
          management_center: formData.locationInfo.management_center || "",
          boulevard: formData.locationInfo.boulevard || "",
          avenue: formData.locationInfo.avenue || "",
          street: formData.locationInfo.street || "",
          next_to: formData.locationInfo.next_to || "",
          house_number: formData.locationInfo.house_number || "",
          apartment: formData.locationInfo.apartment || "",
          common_courtyard: formData.locationInfo.common_courtyard || "",
          building: formData.locationInfo.building || "",
          additionalProp1: {},
        },
        technical_info: {
          branching_type: formData.technicalInfo.branching_type || "",
          electricity_use: formData.technicalInfo.electricity_use || "",
          subscription_type: formData.technicalInfo.subscription_type || "",
          subscriber_type: formData.technicalInfo.subscriber_type || "",
          circuit_breaker_settings:
            formData.technicalInfo.circuit_breaker_settings || "",
          counter_number: formData.technicalInfo.counter_number || "",
          connection_index: formData.technicalInfo.connection_index || "",
          equipment_type: formData.technicalInfo.equipment_type || "",
          price_code: formData.technicalInfo.price_code || "",
          circuit_breaker_grade:
            formData.technicalInfo.circuit_breaker_grade || "",
          pole_number: formData.technicalInfo.pole_number || "",
          additionalProp1: {},
        },
        attachments: attachmentsBase64,
        notify: {
          email: formData.notify?.email || "",
          mobile_number: formData.notify?.mobile_number || "",
          additionalProp1: {},
        },
        additionalProp1: {},
      };

      // Envoyer la requête
      const response = await apiClient.post(
        "/v3/demands/abonnements/",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande d'abonnement:",
        error
      );

      const errorMessage =
        error instanceof AxiosError
          ? extractErrorMessage(error)
          : "Erreur lors de la soumission de la demande";

      // Ajouter l'erreur détaillée à l'objet d'erreur pour qu'elle soit accessible
      if (error instanceof Error) {
        error.message = errorMessage;
      }

      throw error;
    }
  },

  // Soumettre une demande de résiliation
  submitResiliation: async (formData: ResiliationFormData): Promise<any> => {
    try {
      // Convertir les fichiers en base64
      const attachmentsBase64: ResiliationAttachments = {
        id_card: formData.attachments.id_card
          ? await fileToBase64(formData.attachments.id_card)
          : "",
        additionalProp1: {},
      };

      // Construire le corps de la requête
      const requestBody: ResiliationRequestBody = {
        request_info: {
          client_id: formData.requestInfo.client_id || "",
          subscription_number: formData.requestInfo.subscription_number || "",
          counter_number: formData.requestInfo.counter_number || "",
          demand_number: formData.requestInfo.demand_number || "",
          additionalProp1: {},
        },
        personal_info: {
          firstname: formData.personalInfo.firstname || "",
          lastname: formData.personalInfo.lastname || "",
          reference: formData.personalInfo.reference || "",
          identifier: formData.personalInfo.identifier || "",
          email: formData.personalInfo.email || "",
          phone_number: formData.personalInfo.phone_number || "",
          mobile_number: formData.personalInfo.mobile_number || "",
          additionalProp1: {},
        },
        reference_contact: {
          firstname: formData.referenceContact.firstname || "",
          lastname: formData.referenceContact.lastname || "",
          mobile_number: formData.referenceContact.mobile_number || "",
          additionalProp1: {},
        },
        location_info: {
          suburb: formData.locationInfo.suburb || "",
          section: formData.locationInfo.section || "",
          subsection: formData.locationInfo.subsection || "",
          operational_code: formData.locationInfo.operational_code || "",
          boulevard: formData.locationInfo.boulevard || "",
          avenue: formData.locationInfo.avenue || "",
          street: formData.locationInfo.street || "",
          next_to: formData.locationInfo.next_to || "",
          country: formData.locationInfo.country || "",
          counter_number: formData.locationInfo.counter_number || "",
          management_center: formData.locationInfo.management_center || "",
          additionalProp1: {},
        },
        technical_info: {
          bill_reception_way: formData.technicalInfo.bill_reception_way || "",
          circuit_breaker_settings:
            formData.technicalInfo.circuit_breaker_settings || "",
          electricity_usage: formData.technicalInfo.electricity_usage || "",
          branching_type: formData.technicalInfo.branching_type || "",
          equipment_type: formData.technicalInfo.equipment_type || "",
          subscriber_gender: formData.technicalInfo.subscriber_gender || "",
          price_code: formData.technicalInfo.price_code || "",
          additionalProp1: {},
        },
        termination_info: {
          cause: formData.terminationInfo.cause || "",
          concern: formData.terminationInfo.concern || "",
          kennel: formData.terminationInfo.kennel || "",
          kennel_closed: formData.terminationInfo.kennel_closed || "",
          kennel_keeper: {
            firstname: formData.terminationInfo.kennelKeeper.firstname || "",
            lastname: formData.terminationInfo.kennelKeeper.lastname || "",
            mobile_number:
              formData.terminationInfo.kennelKeeper.mobile_number || "",
          },
          additionalProp1: {},
        },
        settings: {
          subscription_type: formData.settings.subscription_type || "",
          subscriber_type: formData.settings.subscriber_type || "",
          additionalProp1: {},
        },
        attachments: attachmentsBase64,
        additionalProp1: {},
      };

      // Envoyer la requête
      const response = await apiClient.post(
        "/v3/demands/resiliations/",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande de résiliation:",
        error
      );

      const errorMessage =
        error instanceof AxiosError
          ? extractErrorMessage(error)
          : "Erreur lors de la soumission de la demande";

      // Ajouter l'erreur détaillée à l'objet d'erreur pour qu'elle soit accessible
      if (error instanceof Error) {
        error.message = errorMessage;
      }

      throw error;
    }
  },

  // Soumettre une demande d'achat de disjoncteur
  submitAchatDisjoncteur: async (
    formData: DisjoncteurFormData
  ): Promise<any> => {
    try {
      // Construire le corps de la requête
      const requestBody: DisjoncteurRequestBody = {
        request_info: {
          client_id:
            formData.requestInfo.client_id ||
            localStorage.getItem("userId") ||
            "",
          country: formData.requestInfo.country || "784",
          counter_number: formData.requestInfo.counter_number || "",
          codexp: formData.requestInfo.codexp || "",
        },
        personal_info: {
          client_firstname: formData.personalInfo.client_firstname || "",
          client_lastname: formData.personalInfo.client_lastname || "",
          client_reference: formData.personalInfo.client_reference || "",
          client_identifier: formData.personalInfo.client_identifier || "",
          client_mobile_number:
            formData.personalInfo.client_mobile_number || "",
          client_phone_number: formData.personalInfo.client_phone_number || "",
        },
        technical_info: {
          branching_type: formData.technicalInfo.branching_type || "",
          electricity_use: formData.technicalInfo.electricity_use || "",
          equipment_type: formData.technicalInfo.equipment_type || "",
          price_code: formData.technicalInfo.price_code || "",
          circuit_breaker_settings:
            formData.technicalInfo.circuit_breaker_settings || "",
          circuit_breaker_grade:
            formData.technicalInfo.circuit_breaker_grade || "",
        },
      };

      // Envoyer la requête
      const response = await apiClient.post(
        "/v3/demands/achats_disjoncteurs/",
        requestBody
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erreur lors de la soumission de la demande d'achat de disjoncteur:",
        error
      );

      const errorMessage =
        error instanceof AxiosError
          ? extractErrorMessage(error)
          : "Erreur lors de la soumission de la demande";

      // Ajouter l'erreur détaillée à l'objet d'erreur pour qu'elle soit accessible
      if (error instanceof Error) {
        error.message = errorMessage;
      }

      throw error;
    }
  },
};

export default demandesService;
