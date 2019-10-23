import { getDB } from '../db';

async function addPost(postObject: any) {
  try {
    let db = await getDB();
  } catch (e) {
    console.log(String(e));
  }
}

export default { addPost };
