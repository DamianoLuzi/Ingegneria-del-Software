export interface Prodotto {
  id: any,
  nome: string,
  prezzo: number,
  id_ristorante: any
}

export interface Ristorante {
  id: any,
  nome: string,
  posizione: string,
  menu: Prodotto[]
}

export interface Utente {
  id: any,
  nome: string,
  username: string,
  email: string,
  ruolo: string,
  is_ristorante: boolean,
  is_rider: boolean,
  is_cliente: boolean
}
