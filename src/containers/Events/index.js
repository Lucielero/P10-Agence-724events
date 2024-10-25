import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);

  const typeList = new Set(data?.events.map((event) => event.type));   // détermine les types d'événements

  // filtrer les événements en fonction du type sélectionné
  const filteredEvents = (
    (!type
      ? data?.events // si aucun type sélectionné, sélection de tous les événements
      : data?.events.filter((event) => event.type === type )) || [] // filtre par type
  );
  
  const totalEvents = data?.events.filter((event) => !type || event.type === type).length || 0; // calcule le nbre total d'événements filtrés
  const pageNumber = Math.ceil(totalEvents / PER_PAGE); // calcule le nbre total de pages 

  const paginatedEvents = filteredEvents.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  // changer le type d'événement
  const changeType = (evtType) => {
    setCurrentPage(1); // réinitaliser la pagination à la 1ère page
    setType(evtType);  // màj du type d'événement
  };

  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {paginatedEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>

          {/* Affichage de la pagination seulement si le nbre d'événements est supérieur à PER_PAGE  */}
          {pageNumber > 1 && (
            <div className="Pagination">
            {Array.from({ length: pageNumber }, (_, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <a 
                key={index + 1}
                href="#events"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage(index + 1);
                }}
              >
                {index + 1}
              </a>
            ))}
          </div>
          )}
        </>
      )}
    </>
  );
};

export default EventList;