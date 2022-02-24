import Link from "next/link";

export default function BuildingPage({pageName}){
    return (
        <div className="force-center">
            <form>
          <h1>La pagina {pageName} esta en construcción....</h1>
          <iframe
            src="https://giphy.com/embed/Yj6d4OMmDV3bnYtOow"
            width="480"
            height="362"
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <Link href="/">
            <button className="btn">HOME</button>
          </Link>
          </form>
        </div>
      );
}