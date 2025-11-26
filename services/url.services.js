import { eq } from "drizzle-orm";
import db from "../db/index.js"
import {urlsTable} from "../models/url.model.js"
import { nanoid } from "nanoid";

export async function insertUrl(url, code, userId){

    const shortCode = code ?? nanoid(6);

    const [result] = await db.insert(urlsTable).values({
        shortCode,
        targetURL: url,
        userId
    }).returning({id: urlsTable.id, shortCode: urlsTable.shortCode, targetURL: urlsTable.targetURL});

    return result;
}

export async function getURL(shortCode) {
    
    const [result] = await db.select().from(urlsTable).where(eq(urlsTable.shortCode, shortCode))

    if(!result){
        throw new Error('Invalid URL')
    }

    return result.targetURL;
}

export async function getAllCodes(userId) {
    
    const codes = await db.select().from(urlsTable).where(eq(urlsTable.userId, userId));

    if(!codes){
        throw new Error('No codes found')
    }

    return codes;
}