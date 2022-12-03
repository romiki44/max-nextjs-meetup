import { useRouter } from 'next/router';
//import { DUMMY_MEETUPS } from '../index';
import MeetupDetail from '../../components/meetups/MeetupDetail';
import { MongoClient, ObjectId } from 'mongodb';
import { Fragment } from 'react';
import Head from 'next/head';

function MeetupDetails(props) {
  //toto bol moj taky pokus...v podstate fungoval
  /*const router = useRouter();
  const meetupId = router.query.meetupId;
  const meetup = DUMMY_MEETUPS.find((m) => m.id === meetupId);
  return (
    <MeetupDetail
      title={meetup.title}
      description={meetup.description}
      id={meetup.id}
      image={meetup.image}
      address={meetup.address}
    />
  );*/

  return (
    <Fragment>
      <Head>
        <title>Meetup Detail</title>
      </Head>
      <MeetupDetail
        title={props.meetupData.title}
        image={props.meetupData.image}
        address={props.meetupData.address}
        description={props.meetupData.description}
      />
    </Fragment>
  );
}

//getStaticProps() znamena, ze sa predrenderuje a vracia cela detail pape
//ALE POZOR...NIE IBA JEDNA VERZIA ALE PRE VSETKY ID!!!! (tu konkretne 3...dobra blbost, alebo?)
//preto treba pouzit getStaticPaths(), kde sa vsetky Id nastavia...tu sice rucne, ale normalne z databazy
export async function getStaticPaths() {
  //connect cez MongoDb...TENTO KOD BEZI NA SERVERI, TAKZE VSETKO OK!
  //kod opakujeme asi na troch miestach, ale max to neriesi, kedze je to len take intro
  //do Nextjs, tak to neriesim ani ja...asi by som mal...ale moc sa nechce :D
  const mongoUrl =
    'mongodb://localhost:27027/meetups?retryWrites=true&w=majority';
  let meetupsId = [];
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db();
    const meetupsColletion = db.collection('meetups');
    //find...{} nacita vsetky polozky...ale vrati len _id {_id: 1}...mongo syntax proste
    meetupsId = await meetupsColletion.find({}, { _id: 1 }).toArray();
    client.close();
  } catch (error) {
    console.log(error);
  }

  return {
    //ak fallback=false...su tu vsetky Id, a ak user zada napr. Id=m4, hodi to 404
    //ak falback=true...tak nie su tu vsetky id, pre nove Id sa pokusi vygenerovat novu stranku dynamicky
    fallback: false, //vsetky id su tu!
    //cez mongo nacitame vsetky id...cize generujeme paths array dynamicky, nie staticky!!
    paths: meetupsId.map((meetup) => {
      return {
        params: {
          meetupId: meetup._id.toString(),
        },
      };
    }),
    /*paths: [
      {
        params: {
          meetupId: 'm1',
        },
      },
      {
        params: {
          meetupId: 'm2',
        },
      },
      {
        params: {
          meetupId: 'm3',
        },
      },
    ],*/
  };
}

export async function getStaticProps(context) {
  //fetch data for single mmetup...pozor, vraj tu nemozeme pozit useRouter(),
  //ten sa moze pouzit iba priamo v componente...cize neviem takto ziskat meetupId z url!
  //mozeme ale pouzit context...tu sice neobsahuje res/req...ale obsahuje params!
  //const meetupId = context.params.meetupId;
  //const meetup = DUMMY_MEETUPS.find((m) => m.id === meetupId);

  const meetupId = context.params.meetupId;

  //kopirujem tento sibnuty kod asi 4-krat!!!
  const mongoUrl =
    'mongodb://localhost:27027/meetups?retryWrites=true&w=majority';
  let selectedMeetup;
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db();
    const meetupsColletion = db.collection('meetups');
    //findOne...najdeme meetup podla meetupId
    selectedMeetup = await meetupsColletion.findOne({
      _id: ObjectId(meetupId),
    });
    client.close();
    //console.log('selectedMeetup:', meetupId, selectedMeetup);
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
      },
    },
  };
}

export default MeetupDetails;
