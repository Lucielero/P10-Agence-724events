import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const byDateDesc = (data?.focus ?? []).sort(
    (evtA, evtB) => new Date(evtB.date) - new Date(evtA.date)
  );
  const nextCard = () => {
      setIndex((prevIndex) => (prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0));
  };
  useEffect(() => {
    const timer = setTimeout(nextCard, 5000);
    return () => clearTimeout(timer); 
  }, [index]); 
  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <div
          key={event.id || event.title} // assure une clé unique pour chaque élément
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      {/* pagination sortie de la boucle map */}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((_, radioIdx) => (
            <input
              readOnly
              key={byDateDesc[radioIdx].id || `radio-${Math.random().toString(36).substr(2, 9)}`} // Clé unique pour la pagination
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;