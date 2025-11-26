import express from 'express'
import {shortenPostRequestBodySchema} from '../validations/request.validation.js'
import { getURL, insertUrl, getAllCodes } from '../services/url.services.js';
import { ensureAuthenticated } from '../middlewares/auth.middleware.js';

const router = express.Router()

router.post('/shorten',ensureAuthenticated, async function (req, res) {

    const validationResult = await shortenPostRequestBodySchema.safeParseAsync(req.body);

    if(validationResult.error){
       return res
         .status(400)
         .json({
           message: validationResult.error.errors
             .map((e) => e.message)
             .join(", "),
         });
    }

    const {url, code} = validationResult.data;

    const result = await insertUrl(url, code, userId);

    return res.status(201).json({result})
})

router.get('/codes', ensureAuthenticated, async function (req, res) {
    
    try {
       const codes = await getAllCodes(req.user.id);
       return res.json({codes});
    } catch (error) {
        console.log(error)
    }
})

router.get('/:shortCode', async function(req, res) {

    const code = req.params.shortCode;

    try {
        const targetURL = await getURL(code);
        return res.redirect(targetURL)

    } catch (error) {
        console.log(error)
    }

})

export default router