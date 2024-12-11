import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [pokemonList, setPokemonList] = useState([]); // To store fetched data for all Pokémon
  const [loading, setLoading] = useState(true);       // To manage loading state
  const [error, setError] = useState(null);
  const [vis, setVis] = useState([]); 
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0) ;

  const pokemonNames = [
    'arcanine',
    'arctibax',
    'axew',
    'baxcalibur',
    'cetitan',
    'cinccino',
    'coalossal',
    'emboar',
    'gabite',
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const promises = pokemonNames.map(async (name) => {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch data for ${name}`);
          }
          const data = await response.json();
          return {
            name: data.name,
            image: data.sprites.other['official-artwork'].front_default,
          };
        });

        const results = await Promise.all(promises);
        setPokemonList(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  function shuffleArray(name) {
    const shuffled = [...pokemonList];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }

    if (vis.some((visited) => visited.name === name)) {
      if(score > bestScore){
        setBestScore(score) ;
      }
      setScore(0);
      setVis([]);
    } else {
      setVis((prevItems) => [...prevItems, { name }]);
      setScore((prevScore) => prevScore + 1);
    }

    setPokemonList(shuffled);
  }

  return (
    <>
      <div className='title'>
        Memory Card Game
      </div>
      <div className='score'>
        <div className='bestScore'>
            BestScore : {bestScore}
        </div>
        <div className='currScore'>
            Score : {score}
        </div>
      </div>
      <div className='container'>
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.name}
            className='card'
            onClick={() => shuffleArray(pokemon.name)}
          >
            <h2 className='name'>{pokemon.name}</h2>
            <img src={pokemon.image} alt={pokemon.name} className='image' />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
