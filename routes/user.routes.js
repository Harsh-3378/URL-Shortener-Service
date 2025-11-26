import express from 'express';
import { hashPassword } from '../utils/hash.js';
import { signupPostRequestSchema, loginPostRequestSchema } from '../validations/request.validation.js';
import { getUserByEmail, createUser } from '../services/user.services.js';
import { createUserToken } from '../utils/token.js';


const router = express.Router()

router.post('/signup', async (req, res)=> {

    const validationResult = await signupPostRequestSchema.safeParseAsync(req.body)

    if(validationResult.error){
        return res.status(400).json({message: validationResult.error.errors.map(e => e.message).join(', ')})
    }

    const {firstname, lastname, email, password} = validationResult.data

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return  res.status(400).json({message: `User with email ${email} already exists`})
    }

    const {hashedPassword, salt} = hashPassword(password)

    const user = await createUser({ firstname, lastname, email, password: hashedPassword, salt });

    return res.status(201).json({data : {userId: user.id }, message: 'User created successfully'})
})

router.post('/login', async (req, res)=> {
    const validationResult = await loginPostRequestSchema.safeParseAsync(req.body)

    if(validationResult.error){
        return res.status(400).json({message: validationResult.error.errors.map(e => e.message).join(', ')})
    }

    const {email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(404).json({error: `User with email ${email} not found`})
    }

    const {hashedPassword} = hashPassword(password, user.salt)

    if(hashedPassword !== user.password){
        return res.status(401).json({message: 'Invalid credentials'})
    }

    const payload = {
        id: user.id,
    }

    const token = await createUserToken(payload)

    return res.cookie(token).status(200).json({token, message: 'Login successful'})
})

export default router