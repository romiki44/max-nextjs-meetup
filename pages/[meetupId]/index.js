import { useRouter } from 'next/router';
import { DUMMY_MEETUPS } from '../index';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails() {
  const router = useRouter();
  const meetupId = router.query.meetupId;
  const meetup = DUMMY_MEETUPS.find((m) => m.id === meetupId);
  /*return (
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
      title='Third Meetup'
      image='https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg/1080px-Copper_lamp_in_the_inner_court_of_the_Staatliche_Kunstsammlungen_-_1486.jpg'
      address='Bonn, Lange Starsse 73, 44850'
      description='This is a third meetup!'
    />
  );
}

export default MeetupDetails;
