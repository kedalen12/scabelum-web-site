import Link from 'next/link';

export default function Custom404() {
  return (
    <div className='force-center'>
      <form>
      <h1>Vaya! Parece que está página no existe!</h1>
      <br></br>
      <iframe
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
            <br></br>
      <Link href="/">
        <button className="btn">HOME</button>
      </Link>
      <br></br>
      <p>Error 404 page was not found!</p>
      </form>
    </div>
  );
}