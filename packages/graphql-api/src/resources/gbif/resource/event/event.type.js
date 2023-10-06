import { gql } from "apollo-server";

const typeDef = gql`
    extend type Query {
        event(id: String!, preview: Boolean): Event
    }

    type Event {
        id: ID
        gbifHref: String
        title: String
        summary: String
        body: String
        excerpt: String
        primaryImage: Image
        primaryLink: Link
        secondaryLinks: [Link]
        start: DateTime
        end: DateTime
        allDayEvent: Boolean
        organisingParticipants: [Participant]
        venue: String
        location: String
        country: String
        coordinates: Coordinates
        eventLanguage: String
        documents: [DocumentAsset]
        attendees: String
        keywords: [String]
        searchable: Boolean
        homepage: Boolean
        gbifRegion: GbifRegion
        createdAt: DateTime
        updatedAt: DateTime
        gbifsAttendee: String
    }
`

export default typeDef;