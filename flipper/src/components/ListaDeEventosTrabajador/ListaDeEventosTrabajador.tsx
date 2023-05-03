import React from "react";
import { evento } from "@/components/ListaDeEventos/Eventos";
import { EventCardTrabajador } from "./EventCardTrabajador";

export interface EventoTrabajador {
  perfil: string;
  nombre: string;
  fecha_inicio: string;
  observaciones: string;
  hora: string;
  lugar: string;
  isDeleted: boolean;
  id: string;
  cupos: number;
  pago: number;
  admitePostulaciones: boolean;
}
interface Props2 {
  eventos: EventoTrabajador[];
}
const ListaEventosTrabajador: React.FC<Props2> = ({ eventos }) => {
  console.log("lista de eventos", eventos);

  //console.log("ListaDeEventos.tsx");
  //console.log(eventos);

  if (eventos?.filter((evento) => evento.isDeleted === false).length === 0) {
    return (
      <div>
        <h2>No se han cargado eventos todavia</h2>
      </div>
    );
  }

  return (
    <div className="w-full md:w-10/12 lg:w-3/5">
      {eventos ? (
        eventos.map((event: EventoTrabajador) => {
          if (event.isDeleted === false) {
            return (
              <div key={`${event.nombre}_key`}>
                <EventCardTrabajador
                  key={event.id}
                  perfil={event.perfil}
                  nombre={event.nombre}
                  fecha_inicio={event.fecha_inicio}
                  observaciones={event.observaciones}
                  hora={event.fecha_inicio}
                  lugar={event.lugar}
                  isDeleted={event.isDeleted}
                  id={event.id}
                  pago={event.cupos}
                  cupos={event.pago}
                  admitePostulaciones={event.admitePostulaciones}
                />
              </div>
            );
          }
        })
      ) : (
        <div>
          <h2>No se han cargado eventos todavia</h2>
        </div>
      )}
    </div>
  );
};
export default ListaEventosTrabajador;