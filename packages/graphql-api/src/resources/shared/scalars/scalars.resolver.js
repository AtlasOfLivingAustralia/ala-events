import {
  URLResolver,
  EmailAddressResolver,
  JSONResolver,
  GUIDResolver,
} from 'graphql-scalars';
import DateTimeResolver from './dateTime.js';
import LongResolver from './long.js';

export default {
  JSON: JSONResolver, // last resort type for unstructured data
  URL: URLResolver,
  DateTime: DateTimeResolver,
  EmailAddress: EmailAddressResolver,
  GUID: GUIDResolver,
  Long: LongResolver,
};
