import { initDb } from "./database";
import { UrlDao } from "./db/url-dao";
import { Url } from "./model/url";
import { encodeStringToBase62 } from "./utils/url";
import { YC } from "./yc";


//redirect
// export async function handler(event: YC.CloudFunctionsHttpEvent, context: YC.CloudFunctionsHttpContext)  {
//     try {
//         await initDb();
//         const urlDao = new UrlDao();
//         await urlDao.initTable(); 

//              const key = event.queryStringParameters?.key;

//       if (!key) {
//         return {
//           statusCode: 400,
//           body: JSON.stringify({ error: "Query parameter 'key' is required." }),
//           headers: { "Content-Type": "application/json" },
//         };
//       }

//       const existing = await urlDao.findByKey(key);
//         if (!existing) {
//             return {
//                 statusCode: 404,
//                 body: JSON.stringify({ error: `Key '${key}' not found` }),
//                 headers: { 'Content-Type': 'application/json' }
//             };
//         }
        
//         return {
//             statusCode: 302,
//             headers: { Location: existing.path },
//             body: ''
//         };
//     } catch (error) {
//         console.error('Error:', error);
//         return {
//             statusCode: 500,
//             body: JSON.stringify({ error: 'Internal server error' }),
//             headers: { 'Content-Type': 'application/json' }
//         };
//     } 
// }


//delete
// export async function handler(event: YC.CloudFunctionsHttpEvent, context: YC.CloudFunctionsHttpContext) {
//   try {
//       await initDb();
//       const urlDao = new UrlDao();
//       await urlDao.initTable(); 
      
//       const key = event.queryStringParameters?.key;

//       if (!key) {
//         return {
//           statusCode: 400,
//           body: JSON.stringify({ error: "Query parameter 'key' is required." }),
//           headers: { "Content-Type": "application/json" },
//         };
//       }

//       const existing = await urlDao.findByKey(key);
//       if (!existing) {
//         return {
//           statusCode: 404,
//           body: JSON.stringify({ error: `Key '${key}' not found` }),
//           headers: { 'Content-Type': 'application/json' }
//         };
//       }
      
//       await urlDao.deleteByKey(key);
    
//       return {
//         statusCode: 200,
//         body: JSON.stringify({ message: `Successfully deleted key: ${key}` }),
//         headers: { 'Content-Type': 'application/json' }
//       };
//   } catch (error) {
//       console.error('Error:', error);
//       return {
//           statusCode: 500,
//           body: JSON.stringify({ error: 'Internal server error' }),
//           headers: { 'Content-Type': 'application/json' }
//       };
//   }
// }


//shorten
export async function handler(event: YC.CloudFunctionsHttpEvent, context: YC.CloudFunctionsHttpContext)  {
    try {
        await initDb();
        const urlDao = new UrlDao();
        await urlDao.initTable(); 

        const pathToShort = event.path;
        if (!pathToShort) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'path is required' }),
                headers: { 'Content-Type': 'application/json' }
            };
        }
        
        const base62Path = encodeStringToBase62(pathToShort);
        const url = new Url(undefined, pathToShort, base62Path);
        await urlDao.save(url);
        
        return {
            statusCode: 200,
            body: base62Path,
            headers: { 'Content-Type': 'text/plain' }
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
}