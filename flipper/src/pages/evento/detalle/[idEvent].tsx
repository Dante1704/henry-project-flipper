import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
//import { traerEventoYPostulantes } from "@/services/traerEventoYPostulantes";
import {
  DetalleEvento,
  TrabajadorStatus,
  objtrabajadoresEnEventos,
} from "../../../types/Types";
import AppLayout from "@/components/AppLayout/AppLayout";
import { HiPencil } from "react-icons/hi";
import { admitirOrestringirPostulaciones } from "@/services/admitirOrestringirPostulaciones";
//import { PostulanteCard } from "@/components/PostulanteCard";
import LoadingSubmitForm from "@/components/LoadingSubmitForm";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { aceptarORechazarPostulante } from "@/services/aceptarORechazarPostulante";
import { useSesionUsuarioContext } from "@/hooks/useSesionUsuarioContext";
import Link from "next/link";
import useSWR, { Fetcher } from "swr";
import { traerEventoYPostulantes } from "@/services/traerEventoYPostulantes";

interface postulante {
  rechazados: TrabajadorStatus[];
  aprobados: TrabajadorStatus[];
  pendientes: TrabajadorStatus[];
  asistieron: TrabajadorStatus[];
  faltaron: TrabajadorStatus[];
}

const EventDatail = () => {
  const { rol } = useSesionUsuarioContext();
  const router = useRouter();
  const { idEvent } = router.query;
  const [rows, setRows] = useState<{}[]>([]);

  const { data, isLoading, error } = traerEventoYPostulantes(idEvent);
  //const rows: any[] = []
  data?.trabajadores.map((objIntermedio: objtrabajadoresEnEventos) => {
    const formatedObj = {
      Nombre: objIntermedio.trabajadores?.name,
      Perfil: data?.perfil,
      trabajadorId: objIntermedio.trabajadorId,
      status: objIntermedio.status,
    };
    setRows((prev) => [...prev, formatedObj]);
  });
  console.log(data);
  const handleadmitirOrestringirPostulaciones = async () => {
    const admitePostulaciones = !data?.admitePostulaciones;
    try {
      await admitirOrestringirPostulaciones(
        idEvent as string,
        admitePostulaciones
      );
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "Nombre",
      headerName: "Nombre",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "Perfil",
      headerName: "Perfil",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },

    {
      field: "trabajadorId",
      headerName: "UUID",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.2,
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-theme--cell",
      editable: true,
      type: "singleSelect",
      valueOptions: ["APROBADO", "RECHAZADO", "PENDIENTE", "FALTO", "ASISTIO"],
    },

    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      renderCell: (params) => (
        <button
          className="rounded-md bg-black text-white"
          onClick={() => {
            let idPostulante = params.row.UUID;
            let statusNuevo = params.row.Status;
            aceptarORechazarPostulante({ idPostulante, statusNuevo, idEvent });
          }}
        >
          Actualizar
        </button>
      ),
    },
  ];
  if (isLoading) return <div>Cargando...</div>;
  return (
    <AppLayout>
      <div className="h-full">
        <div className="bg-gray-200">
          <div className="flex flex-col justify-center items-center gap-10 relative">
            <div className="w-full flex flex-row justify-between items-center mt-16 md:mt-0">
              <p className="w-full bg-white text-center text-[#4B39EF] font-bold text-xl py-4 relative">
                Evento: {data?.nombre}
                {rol === "empresa" && (
                  <HiPencil
                    className="text-[#f6ea06] absolute top-3 right-3 rounded-xl border-indigo-700 border-2 border-solid bg-indigo-700 transition duration-200 hover:bg-[#605BDC] cursor-pointer"
                    size={30}
                  />
                )}
              </p>
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col">
                <p className="text-center font-bold text-xl text-black">
                  Fecha de Inicio:
                </p>
                <p className="text-center font-bold text-lg">
                  {data?.fecha_inicio}
                </p>
              </div>
              <div className="flex flex-col">
                <p className="text-center font-bold text-xl text-black">
                  Fecha de Finalizacion:
                </p>
                <p className="text-center font-bold text-lg">
                  {data?.fecha_final}
                </p>
              </div>
            </div>
            <div className="flex gap-10">
              <div className="flex flex-col">
                <p className="text-center font-bold text-xl text-black">
                  Perfiles Solicitados:
                </p>
                <p className="text-center font-bold text-lg"> {data?.perfil}</p>
              </div>
              <div className="flex flex-col">
                <p className="text-center font-bold text-xl text-black">
                  Ciudad Y Dirección:
                </p>
                <p className="text-center font-bold text-lg">{data?.lugar}</p>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-center font-bold text-xl text-black">
                Observaciones:
              </p>
              <p className="text-center font-bold text-lg">
                {data?.observaciones}
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            {rol === "empresa" ? (
              <div className="flex flex-col items-center my-8 w-11/12 lg:w-9/12">
                {isLoading ? (
                  <LoadingSubmitForm />
                ) : (
                  <button
                    className="btn bg-[#4B39EF] normal-case text-[24px] text-white border-transparent hover:bg-[#605BDC] mb-4"
                    onClick={handleadmitirOrestringirPostulaciones}
                  >
                    {data?.admitePostulaciones
                      ? "Cerrar Postulaciones"
                      : "Abrir Postulaciones"}
                  </button>
                )}
                <Box
                  sx={{
                    height: 300,
                    width: "100%",
                    "& .super-app-theme--header": {
                      backgroundColor: "rgba(229, 231, 235)",
                      color: "#000000",
                    },
                    "& .super-app-theme--cell": {
                      backgroundColor: "rgba(229, 231, 235)",
                      color: "#000000",
                      fontWeight: "600",
                    },
                    border: 2,
                    borderColor: "black",
                  }}
                >
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    getRowId={(row) => row.trabajadorId}
                    pageSizeOptions={[5, 10, 25]}
                    initialState={{
                      pagination: { paginationModel: { pageSize: 5 } },
                    }}
                  />
                </Box>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default EventDatail;

{
  /* <ul>
  {eventDetail?.trabajadores?.map((trabajadorPorEvento) => {
    const idPostulante = trabajadorPorEvento.trabajadorId;
    if (trabajadorPorEvento.status === "PENDIENTE")
      return (
        <>
          <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
            Pendientes
          </p>

          <PostulanteCard
            idEvent={idEvent as string}
            idPostulante={idPostulante}
            nombre={trabajadorPorEvento.trabajadores.name}
            status={trabajadorPorEvento.status}
          />

        </>
      );
    if (trabajadorPorEvento.status === "RECHAZADO")
      return (
        <>
          <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
            Rechazados
          </p>

          <PostulanteCard
            idEvent={idEvent as string}
            idPostulante={idPostulante}
            nombre={trabajadorPorEvento.trabajadores.name}
            status={trabajadorPorEvento.status}
          />

        </>
      );
    return (
      <>
        <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
          Aprobados
        </p>

        <PostulanteCard
          idEvent={idEvent as string}
          idPostulante={idPostulante}
          nombre={trabajadorPorEvento.trabajadores.name}
          status={trabajadorPorEvento.status}
        />

      </>
    );
  })} */
  /*
            
            <div className="flex flex-col justify-center items-center ">
            <div>
              <p className="p-4 mt-4 font-bold border-b-2 border-b-indigo-600 text-indigo-600 text-5xl pr-6 pl-6 rounded-sm mb-8">
                Postulaciones
              </p>
            </div>
            <div className="h-full">
              <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
                Pendientes
              </p>
              <ul>
                {postulantes?.pendientes.map((postulante) => {
                  return (
                    <PostulanteCard
                      key={postulante.trabajadorId}
                      idEvent={idEvent as string}
                      idPostulante={postulante.trabajadorId}
                      nombre={postulante.trabajadores.name}
                      status={postulante.status}
                    />
                  );
                })}
              </ul>
              <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
                Aprobados
              </p>
              <ul>
                {postulantes?.aprobados.map((postulante) => {
                  return (
                    <PostulanteCard
                      key={postulante.trabajadorId}
                      idEvent={idEvent as string}
                      idPostulante={postulante.trabajadorId}
                      nombre={postulante.trabajadores.name}
                      status={postulante.status}
                    />
                  );
                })}
              </ul>
              <p className="font-bold text-white text-2xl bg-indigo-600 p-2 pr-6 pl-6 rounded-sm mb-4 mt-4">
                Rechazados
              </p>
              <ul className="mb-8">
                {postulantes?.rechazados.map((postulante) => {
                  return (
                    <PostulanteCard
                      key={postulante.trabajadorId}
                      idEvent={idEvent as string}
                      idPostulante={postulante.trabajadorId}
                      nombre={postulante.trabajadores.name}
                      status={postulante.status}
                    />
                  );
                })}
              </ul>
            </div>
          </div>
          */
  //useEffect(() => {
  //if (idEvent) {
  //traerEventoYPostulantes(idEvent as string)
  //.then((data) => {
  //setEventDetail(data);
  //})
  //.catch((error) => console.log(error.message));
  // }
  //}, [idEvent, loading]);
  //useEffect(() => {
  //if (eventDetail) {
  // eventDetail?.trabajadores.map((trabajadorPorEvento) => {
  // let objPush = {
  // id: id++,
  // UUID: trabajadorPorEvento.trabajadorId,
  //Nombre: trabajadorPorEvento.trabajadores.name,
  //Perfil: eventDetail?.perfil,
  //Status: trabajadorPorEvento.status,
  //};
  //if (rows.length < eventDetail.trabajadores.length) {
  //setRows((prev) => [...prev, objPush]);
  //}
  //});
  // }
  //}, [eventDetail]);
}
