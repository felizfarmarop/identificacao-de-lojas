"use client";

import EmpresaTable from "../components/StoreTable";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tabela de Empresas</h1>
      <EmpresaTable />
    </main>
  );
}
