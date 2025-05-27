import { PROFILE_FIELDS, MEDIA_FIELDS, MEDIA_CHILDREN_FIELDS } from './constants';

export const buildProfileQuery = (username: string) => `
  business_discovery.username(${username}){
    ${PROFILE_FIELDS},
    media.limit(50){
      ${MEDIA_FIELDS},
      children{
        ${MEDIA_CHILDREN_FIELDS}
      }
    }
  }
`;

export const buildHashtagQuery = (hashtagId: string) => `
  ${hashtagId}/top_media?fields=${MEDIA_FIELDS}
`;