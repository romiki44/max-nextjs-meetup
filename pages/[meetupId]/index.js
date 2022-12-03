import { useRouter } from 'next/router';
import { DUMMY_MEETUPS } from '../index';
import MeetupDetail from '../../components/meetups/MeetupDetail';

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
    <MeetupDetail
      title={props.meetupData.title}
      image={props.meetupData.image}
      address={props.meetupData.address}
      description={props.meetupData.description}
    />
  );
}

//getStaticProps() znamena, ze sa predrenderuje a vracia cela detail pape
//ALE POZOR...NIE IBA JEDNA VERZIA ALE PRE VSETKY ID!!!! (tu konkretne 3...dobra blbost, alebo?)
//preto treba pouzit getStaticPaths(), kde sa vsetky Id nastavia...tu sice rucne, ale normalne z databazy
export async function getStaticPaths() {
  return {
    //ak fallback=false...su tu vsetky Id, a ak user zada napr. Id=m4, hodi to 404
    //ak falback=true...tak nie su tu vsetky id, pre nove Id sa pokusi vygenerovat novu stranku dynamicky
    fallback: false, //vsetky id su tu!
    paths: [
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
    ],
  };
}

export async function getStaticProps(context) {
  //fetch data for single mmetup...pozor, vraj tu nemozeme pozit useRouter(),
  //ten sa moze pouzit iba priamo v componente...cize neviem takto ziskat meetupId z url!
  //mozeme ale pouzit context...tu sice neobsahuje res/rea...ale obsahuje params!
  const meetupId = context.params.meetupId;
  const meetup = DUMMY_MEETUPS.find((m) => m.id === meetupId);
  return {
    props: {
      meetupData: {
        id: meetupId,
        title: meetup.title,
        image: meetup.image,
        address: meetup.address,
        description: meetup.description,
      },
    },
  };
}

export default MeetupDetails;
