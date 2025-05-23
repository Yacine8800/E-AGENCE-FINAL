import { decodeToken } from "react-jwt";

interface TokenData {
	_id: string;
	login: string;
	onlineId: string | null;
	iat: number;
	exp: number;
}

interface UserInfo {
	token: string | null;
	tokenData: TokenData | null;
}

const getUserInfo = (): UserInfo => {
	const token = localStorage.getItem("token");
	console.log(token, 'token')
	if (token) {
		try {
			const tokenData = decodeToken<TokenData>(token);
			console.log(tokenData, 'tokenData')
			return {
				token,
				tokenData
			};
		} catch (error) {
			console.error("Erreur lors du décodage du token :", error);
		}
	}
	return {
		token: null,
		tokenData: null
	};
};

export default getUserInfo;
