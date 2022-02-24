export default function Loader({ show, big }){
    return show ? <div className={big ? 'loader-big' : 'loader'}></div> : null;
}