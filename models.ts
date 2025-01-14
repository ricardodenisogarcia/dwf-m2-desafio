import * as jsonfile from "jsonfile";
import * as lodash from "lodash";

// no modificar estas propiedades, agregar todas las que quieras
class Peli {
  id: number;
  title: string;
  tags: string[];
}

class PelisCollection {
  dataPelis: Peli[] = [];
  getAll(): Promise<Peli[]> {
    return jsonfile.readFile("./pelis.json").then((peliculas) => {
      return (this.dataPelis = peliculas);
    });
  }
  getById(id: number) {
    return this.getAll().then((resp) => {
      const resultado = resp.find((peli) => {
        return peli.id == id;
      });
      return resultado;
    });
  }
  search(options: any) {
    return this.getAll().then((resp) => {
      var resultadoOptions;
      if (options.title && options.tag) {
        var resultadoMixto = lodash.filter(
          resp,
          (film) =>
            film.title.toLocaleLowerCase().includes(options.title) &&
            film.tags.includes(options.tag)
        );
        return (resultadoOptions = resultadoMixto);
      }
      if (options.title) {
        var resultadoTitle = resp.filter((peli) => {
          return peli.title.toLocaleLowerCase().includes(options.title);
        });
        resultadoOptions = resultadoTitle;
      }
      if (options.tag) {
        var resultadoTag = resp.filter((peli) => {
          return peli.tags.includes(options.tag);
        });
        resultadoOptions = resultadoTag;
      }
      return resultadoOptions;
    });
  }
  add(peli: Peli): Promise<boolean> {
    const promesaUno = this.getById(peli.id).then((peliExistente) => {
      if (peliExistente) {
        return false;
      } else {
        const data = this.dataPelis.concat(peli);
        const promesaDos = jsonfile.writeFile("./pelis.json", data);
        return promesaDos.then(() => {
          return true;
        });
      }
    });
    return promesaUno;
  }
}

export { PelisCollection, Peli };
/* codigo para test unitarios manuales
function main() {
  const dataMock = new PelisCollection();
  const promesaMock = dataMock.search({ tag: "nacional" }).then((resp) => {
    console.log(resp);
  });
  // console.log(promesaMock);
}
main();
*/
