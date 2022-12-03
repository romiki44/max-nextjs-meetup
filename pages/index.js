import MeetupList from '../components/meetups/MeetupList';
import { Fragment } from 'react';
import { MongoClient } from 'mongodb';
import Head from 'next/head';

/*export const DUMMY_MEETUPS = [
  {
    id: 'm1',
    title: 'First Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/1065px-Stadtbild_M%C3%BCnchen.jpg',
    address: 'Munich, HaupPlatz 17, 41200',
    description: 'This is a first meetup!',
  },
  {
    id: 'm2',
    title: 'Second Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg/1080px-Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg',
    address: 'Dresden, DreiPlatz 34, 45900',
    description: 'This is a second meetup!',
  },
  {
    id: 'm3',
    title: 'Third Meetup',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg/1080px-Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg',
    address: 'Bonn, Lange Starsse 73, 44850',
    description: 'This is a third meetup!',
  },
];*/

function HomePage(props) {
  //const [loadedMeetups, setLoadedMeetups] = useState([]);

  //akoze http-request
  //useEffect...najpr prvy renrdering componentu...potom sa spusti useEffect...
  //nakoniec zbehne druhy renrdering...cize component sa renderuje 2x(!)...jednak bude treba LoadingSpinner
  //ale  horsie je, ze prerenderovany nextjs component sa vytvara len z prveho renderu, dalsie rendery ignoruje!!
  //tym padom prerenderovane pole Meetups v html-source-page bude prazdne!!!
  /*useEffect(() => {
    setLoadedMeetups(DUMMY_MEETUPS);
  }, []);*/

  //<Head/> sa da vyuzit na nastavenie metadat, nepr. pre google vyhladavac
  return (
    <Fragment>
      <Head>
        <title>NextJs Meetups Page</title>
        <meta
          name='description'
          content='Browse a huge list of highly atractive meetups'
        />
      </Head>
      <MeetupList meetups={props.meetups}></MeetupList>
    </Fragment>
  );
}

//lepsie ako getStaticProps()...nerobi sa build, ale bezi na serveri...neviem, tak nejako
//nepotrebuje nastavit interval, lebo sa spusta a vykonava pri kazdom requeste...samozrejme na serveri...na akom vlastne, hehe?
//otazka co je lepsie...getStaticProps() moze byt rychlejsie, lebo sa renderuje len raz za cas
//getServerSideProps() sa renderuje stale, cize moze spomalovat...ak sa data moc nemenie, je to nevyhodne
//napr. tu, kedze by to bol akysi staticky zoznam Meetupsov, tak vyhodnejsie by bolo urcite pouzit
//getStaticProps(), lebo vlastne cachujeme zoznam a je to rychle!!...
/*export async function getServerSideProps(context) {
  //da sa pouzit objekt aj request, response
  const req = context.req;
  const res = context.res;

  return {
    props: {
      meetups: DUMMY_MEETUPS,
    },
  };
}*/

//nextjs vola tuto funkciu pred rederovanim a caka kym nezbehne
//pozor, uloha bezi akoby na serveri, cize klient o nej nic nevie!
//NAKONIEC SME POUZILI TUTU METODU...DATA SA NEMENIA, SU AKOBY V CACHE, CIZE JE TO RYCHLE
export async function getStaticProps() {
  //vrati props, ktore pouzije ako argument HomePage(props)!!
  //tym padom nepotreebujem useEffect(), ani UseState()...vsetko sa nacita tu vrati cez props!!!
  //cize tu treba urobit http-data-request...a potom data videme aj v statickej html-stranke

  //connect cez MongoDb...TENTO KOD BEZI NA SERVERI, TAKZE VSETKO OK!
  const mongoUrl =
    'mongodb://localhost:27027/meetups?retryWrites=true&w=majority';
  let meetups = [];
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db();
    const meetupsColletion = db.collection('meetups');
    //find() nacita vsetky polozky
    meetups = await meetupsColletion.find().toArray();
    //console.log('meetups', meetups);
    client.close();
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      //meetups: DUMMY_MEETUPS,
      meetups: meetups.map((meetup) => {
        return {
          id: meetup._id.toString(),
          title: meetup.title,
          image: meetup.image,
          address: meetup.address,
          description: meetup.description,
        };
      }),
    },
    //problem je, ze starnka sa vygeneruje iba raz, na zaxiatku...asle ak sa zmeni zoznam, co potom?
    //vraj treba nastavit revalidate: 10...tzn. ze kazdych 10s bude server opat generovat tuto stranku? dobra blbost!!
    //bude chem SPA ale SSR, ale asi sa neda naraz obidve :D
    revalidate: 10, //data nebudu starsie, neaktualne ako 10s!!! Hehe, dobry joge...
  };
}

export default HomePage;
