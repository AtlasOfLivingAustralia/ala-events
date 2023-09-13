import { z } from "zod";
import { DateAsStringSchema, pickLanguage } from "../../utils";
import { DataMapper, ElasticSearchAssetSchema, ElasticSearchLinkSchema, parseElasticSearchAssetDTO, parseElasticSearchLinkDTO, createElasticSearchMapper } from "./_shared";
import { Event } from "../../contentTypes/event";

export const elasticSearchEventMapper: DataMapper<Event> = createElasticSearchMapper({
    contentType: 'event',
    fields: z.object({
        id: z.string(),
        title: z.record(z.string(), z.string()),
        summary: z.record(z.string(), z.string()).optional(),
        body: z.record(z.string(), z.string()).optional(),
        primaryImage: ElasticSearchAssetSchema.optional(),
        primaryLink: ElasticSearchLinkSchema.optional(),
        secondaryLinks: z.array(ElasticSearchLinkSchema).optional(),
        start: DateAsStringSchema,
        end: DateAsStringSchema,
        allDayEvent: z.boolean().optional(),
        organisingParticipants: z.array(
            z.object({
                id: z.string(),
                country: z.string(),
                title: z.record(z.string(), z.string())
            })
        ).optional(),
        venue: z.string().optional(),
        location: z.string().optional(),
        country: z.string().optional(),
        coordinates: z.unknown().optional(),
        eventLanguage: z.record(z.string(), z.string()).optional(),
        documents: z.array(ElasticSearchAssetSchema).optional(),
        attendees: z.unknown().optional(),
        keywords: z.array(z.string()).optional(),
        searchable: z.boolean().optional().default(false),
        homepage: z.boolean().optional().default(false),
    }),
    map: dto => ({
        contentType: 'event',
        id: dto.id,
        title: pickLanguage(dto.title),
        summary: dto.summary == null ? undefined : pickLanguage(dto.summary),
        body: dto.body == null ? undefined : pickLanguage(dto.body),
        primaryImage: dto.primaryImage == null ? undefined : parseElasticSearchAssetDTO(dto.primaryImage),
        primaryLink: dto.primaryLink == null ? undefined : parseElasticSearchLinkDTO(dto.primaryLink),
        secondaryLinks: dto.secondaryLinks == null ? [] : dto.secondaryLinks.map(parseElasticSearchLinkDTO),
        start: dto.start,
        end: dto.end,
        allDayEvent: dto.allDayEvent,
        organisingParticipants: dto.organisingParticipants?.map(p => ({
            id: p.id,
            country: p.country,
            title: pickLanguage(p.title),
        })) ?? [],
        venue: dto.venue,
        location: dto.location,
        country: dto.country,
        coordinates: dto.coordinates,
        eventLanguage: dto.eventLanguage == null ? undefined : pickLanguage(dto.eventLanguage),
        documents: dto.documents == null ? [] : dto.documents.map(parseElasticSearchAssetDTO),
        keywords: dto.keywords ?? [],
        searchable: dto.searchable,
        homepage: dto.homepage,
    })
})