import jwt from 'jsonwebtoken'
import { userTokenSchema } from '../validations/token.validation.js';

const JWT_SECRET = process.env.JWT_SECRET

export async function createUserToken(payload){
    
    const validationResult = await userTokenSchema.safeParseAsync(payload);

    if(validationResult.error){
        throw new Error(validationResult.error.message)
    }

    const data = validationResult.data

    const token = jwt.sign(data, JWT_SECRET, {expiresIn: '1d'})

    return token;
}

export function validateUserToken(token){

   try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        return payload;

   } catch (error) {
        console.log(error)
        return null
   }

}