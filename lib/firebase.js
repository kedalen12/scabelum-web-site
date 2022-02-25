import { ProviderId } from 'firebase/auth';
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import toast from 'react-hot-toast';

const firebaseConfig = {
    apiKey: "AIzaSyAreAoQKgGpP0lS6hNkEaIPSEmmOQXSpWM",
    authDomain: "scabelum-auth.firebaseapp.com",
    projectId: "scabelum-auth",
    storageBucket: "scabelum-auth.appspot.com",
    messagingSenderId: "256298633802",
    appId: "1:256298633802:web:d11adc1304408cb798f4b3",
    measurementId: "G-WK032YZ5QH"
  };

  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig)
  }

  export const auth = firebase.auth(firebase.app());
  export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
  export const emailAuthProvider = new firebase.auth.EmailAuthProvider();
  export const firestore = firebase.firestore();
  export const storage = firebase.storage();
  export const fromMillis = firebase.firestore.Timestamp.fromMillis;
  export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

  async function getNameLastNameAndRest(completeName){
    const splitedName = completeName.trimStart().trimEnd().split(' ')
    if(splitedName.length <= 0){
      //ERROR SUPREMO NO HAY NOMBRE
      return {
        error : 'El nombre estaba vacío o eran espacions en blanco',
        success : false
      }
    }

    const name = splitedName[0]
    const lastName = splitedName.length >= 1 ? splitedName[1] : null;
    const restName = splitedName.length >= 2 ? splitedName[2] : null

    return {
        name,
        lastName,
        restName
    }
  }


  export async function signInAsync(Provider, email, password){
    try {
      if(Provider === Provider.GOOGLE){
        //Esto sera el signin with popup
        await auth.signInWithPopup(Provider.GOOGLE);
        return {
          success : true
        }
      } else {
        await auth.signInWithEmailAndPassword(email, password)
        return {
          success : true
        }
      }
    } catch(e){
      return {
        success : false,
        error : getFirebaseLoginErrorFormated(e.code)
      }
    }
  }

  export async function createUserAsync(Provider, email, password, completeName){
    try {
      let user = {}
      const d = new Date()
      const parsedName = await getNameLastNameAndRest(completeName)
      if(Provider === ProviderId.GOOGLE){
        user = await auth.signInWithPopup(ProviderId.GOOGLE);
        firestore.doc(`users/${auth.currentUser.uid}`).set(
          {
            firstName: parsedName.name,
            secondName: parsedName.lastName,
            lastName: parsedName.restName,
            admin: false,
            createdAt: d.getTime(),
            lastLogin: d.getTime(),
            verified: true
        })
      } else {
        user = await auth.createUserWithEmailAndPassword(email, password)
        firestore.doc(`users/${auth.currentUser.uid}`).set(
          {
            firstName: parsedName.name,
            secondName: parsedName.lastName,
            lastName: parsedName.restName,
            admin: false,
            createdAt: d.getTime(),
            lastLogin: d.getTime(),
            verified: false
        })

      }
      return {
        success : true,
        verified : Provider === ProviderId.GOOGLE
      }
    } catch(e){
        toast.error(e.toString())
        return {
          success : false,
          error : e.code
        }
    }
  }

  //This returns the top 10 most recentPosts without considering anything else
  export async function getRecentPosts(){
    const query =  firestore.collection('posts')
    .where('published', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(10);
    return (await query.get()).docs.map(postToJSON)
  }
 
  export async function getPostBySlug(slug){
    const query = firestore.collection('posts')
    .where('slug', '==', slug)
    .limit(1)
    let serializedPosts = (await query.get()).docs.map(postToJSON);
    if(serializedPosts){
      return serializedPosts[0]
    } else {
      return null;
    }
  }

  //This returns the top 10 most recentPosts of a recetain author
  export async function getRecentPostsOfAuthor(author_id){
    const query =  firestore.collection('posts')
    .where('published', '==', true)
    .where('author_id','==', author_id)
    .orderBy('createdAt', 'desc')
    .limit(10);
    return (await query.get()).docs.map(postToJSON)
  } 

  //This returns the top 10 most liked posts
  export async function getMostLikedPosts(){

  }
  
  export function getFirebaseLoginErrorFormated(code, inputs){
    if(code === 'auth/email-already-in-use'){
     return `El email ${inputs.email} ya esta registrado`
    }
    if(code ==='auth/app-deleted'){
      return 'Esta applicación ya no existe'
    }
    if(code ==='auth/app-not-authorized'){
      return 'Esta applicación no esta autorizada'
    }
    if(code ==='auth/argument-error'){
      return 'Alguno de los campos era invalido'
    }
    //FB#001
    if(code ==='auth/invalid-api-key'){
      return 'Error interno del servidor Codigo -> FB#001'
    }
    //FB#002
    if(code ==='auth/invalid-user-token'){
      return 'Error interno del servidor Codigo -> FB#002'

    }
        //FB#003
    if(code ==='auth/invalid-tenant-id'){
      return 'Error interno del servidor Codigo -> FB#003'
    }
            //FB#004
    if(code ==='auth/network-request-failed'){
      return 'Error interno del servidor Codigo -> FB#004'
    }
    //FB#005
    if(code ==='auth/operation-not-allowed'){
      return 'Error interno del servidor Codigo -> FB#005'
    }
        //FB#006
    if(code ==='auth/requires-recent-login'){
      return 'Error interno del servidor Codigo -> FB#006'
    }
            //FB#007
    if(code ==='auth/too-many-requests'){
      return 'Error interno del servidor Codigo -> FB#007'
    }
                //FB#008

    if(code ==='auth/unauthorized-domain'){
      return 'Error interno del servidor Codigo -> FB#008'
    }
    if(code ==='auth/user-disabled'){
      return 'Este usuario esta desactivado'
    }
                    //FB#009
    if(code ==='auth/user-token-expired'){
      return 'Error interno del servidor Codigo -> FB#009'

    }
                        //FB#010
    if(code ==='auth/web-storage-unsupported'){
      return 'Error interno del servidor Codigo -> FB#010'
    }

                            //FB#011

    return `Error interno del servidor Codigo -> FB#011 ${code}}`

  }


  export function postToJSON(doc) {
    
    if(!doc){
      return null;
    }
    try {
      const data = doc.data();
    return {
      ...data,
      docId: doc.id,
      createdAt: data.createdAt.toMillis(),
    }
    } catch(e){
      return null;
    }

  }