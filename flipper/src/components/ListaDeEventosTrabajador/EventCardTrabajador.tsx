import { AiFillDelete, AiFillClockCircle } from "react-icons/ai";
import { HiPencil } from "react-icons/hi";
import { IoLocationSharp } from "react-icons/io5";
import { Props, evento } from "@/components/ListaDeEventos/Eventos";
import { useRouter } from "next/router";
import { EventoTrabajador } from "./ListaDeEventosTrabajador";
import { useSesionUsuarioContext } from "@/hooks/useSesionUsuarioContext";

import Link from "next/link";
interface EventCardProps {
  nombreEvento: string;
  fechaEvento: string;
  observaciones: string;
  hora: string;
  direccion: string;
  idEvento: string;
}

export const EventCardTrabajador: React.FC<EventoTrabajador> = (evento) => {
  /* console.log("card", evento); */
  const { id } = useSesionUsuarioContext();
  const router = useRouter();

  return (
    <div className="bg-white rounded-md border-2 border-[#787d81] h-full flex flex-col justify-between p-2 mb-2 w-full">
      <div className="flex justify-between">
        <Link href={`/evento/detalle/${evento.id}`}>
          <p className="text-indigo-700 text-2xl font-bold">{evento.nombre}</p>
        </Link>
      </div>
      <hr></hr>
      <div className="text-indigo-700 flex">
        <div className="flex-1">
          <p className="text-2xl font-bold">
            {evento.fecha_inicio.slice(0, 10)}
          </p>
          <p>
            <span className="font-bold mt-2 mb-2">Perfil:</span> {evento.perfil}
          </p>
          <p className="mb-1">
            <span className="font-bold mt-2 mb-2">Observaciones:</span>{" "}
            {evento.observaciones}
          </p>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {evento.admitePostulaciones ? (
            <button
              className="bg-black rounded-md"
              onClick={async () => {
                let response = await fetch("/api/trabajadoreseneventos", {
                  method: "POST",
                  body: JSON.stringify({
                    trabajadorId: id,
                    eventoId: evento.id,
                  }),
                  headers: {
                    "Content-type": "application/json; charset=UTF-8",
                  },
                })
                  .then((response) => response.text())
                  .then((msg) => {
                    alert(msg);
                    if (msg === "postulacion realizada con exito") {
                      router.push(`/evento/detalle/${evento.id}`);
                    } else if (
                      msg === "No se aceptan mas postulaciones en este evento"
                    ) {
                      router.reload();
                    }
                  });
              }}
            >
              Postularse
            </button>
          ) : (
            <p>no se admiten mas postulaciones</p>
          )}
        </div>
      </div>
      <div className="text-[#4031c6] flex items-center gap-1 capitalize">
        <AiFillClockCircle />
        <p className="mr-5">{evento.hora.slice(11, 16)}</p>
        <IoLocationSharp />
        {evento.lugar}
      </div>
    </div>
  );
};