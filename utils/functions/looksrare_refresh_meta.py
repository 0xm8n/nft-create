"""
Refreshes the metadata in a specified collection given the owner address
"""
import json
from typing import List
import requests
import time

LOOKS_RARE_GRAPHQL_ENDPOINT = "https://api-rinkeby.looksrare.org/graphql"
OWNER = "0x94021138093918b6E0DDb275272bD638C22df912"
COLLECTION = "0xF655bDdc632c8dd697335FD7eFd6374521314bdc"

def refresh_metadata():
    """Main method for the file"""
    print("refresh collection")
    all_ntfs = get_array_of_all_items(owner=OWNER, collection=COLLECTION)
    size_of_chunk = 100
    while all_ntfs:
        chunk_to_send = all_ntfs[:size_of_chunk]
        all_ntfs = all_ntfs[size_of_chunk:]
        refresh_metadata_for_list_of_items(token_ids=chunk_to_send, collection=COLLECTION)
        time.sleep(0.5)

def refresh_metadata_for_list_of_items(token_ids: List[str], collection: str):
    """Refreshes the metadata for an individual item"""
    effective_query = ""
    for token_id in token_ids:
        effective_query += get_query_for_multiple_item_metadata_refresh(
            token_id=token_id, collection=collection)
    effective_query = f"mutation {{ {effective_query} }}"
    headers = {"Content-Type": "application/json",
               "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)"}
    response = requests.post(LOOKS_RARE_GRAPHQL_ENDPOINT,
                             json={'query': effective_query},
                             headers=headers)
    response_json = json.loads(response.text)
    if (response.status_code != 200 or
        response_json is None or
        response_json["data"] is None):
        print(f"{collection}: {token_ids[0]}-{token_ids[len(token_ids)-1]} block failed")
        return False
    for token_id in token_ids:
        token_id_name = f"t{token_id}"
        token_refresh_success = response_json["data"][token_id_name]["success"]
        token_refresh_message = response_json["data"][token_id_name]["message"]
        print(f"{collection}-{token_id}:  {token_refresh_success} - {token_refresh_message}")

def get_array_of_all_items(owner: str, collection: str) -> List[str]:
    """Returns all of the items owned by an owner of the type specified by the collection"""
    headers = {"Content-Type": "application/json",
               "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.0)"}
    return_me = []
    should_continue = True
    curr_cursor = ""
    while should_continue:
        query = get_query_for_items()
        variables = get_variables_for_items(owner=owner, collection=collection,
                                   cursor=None if curr_cursor == "" else curr_cursor)
        response = requests.post(LOOKS_RARE_GRAPHQL_ENDPOINT, 
                                 json={'query': query, 'variables': variables}, 
                                 headers=headers)
        print(response.text)
        response_json = json.loads(response.text)
        if (response_json is None or
            response_json["data"] is None or
            response_json["data"]["tokens"] is None or
            len(response_json["data"]["tokens"]) == 0):
            should_continue = False
        else:
            for nft in response_json["data"]["tokens"]:
                curr_cursor = nft["id"]
                return_me.append(nft["tokenId"])
        
        time.sleep(0.5)
    return return_me

def get_query_for_items() -> str:
    """returns the query that will get the items in a collection owned by someone"""
    return "query GetTokens($filter: TokenFilterInput, $pagination: PaginationInput, $sort: TokenSortInput) {tokens(filter: $filter, pagination: $pagination, sort: $sort) {id, tokenId}}"

def get_variables_for_items(owner: str, collection: str, cursor: str = None):
    """returns the variables that will get the items in a collection owned by someone"""
    if cursor is not None:
        return {
                    "filter": {"collection": collection,"owner": owner},
                    "pagination": {"first": 100, "cursor": cursor },
                    "sort":"LAST_RECEIVED"
                }
    return {
                "filter": {"collection": collection,"owner": owner},
                "pagination": {"first": 100 },
                "sort":"LAST_RECEIVED"
            }

def get_query_for_multiple_item_metadata_refresh(token_id: str, collection: str):
    """returns the query that is used for multiple item refreshes at once"""
    return f"t{token_id}: refreshToken(tokenId: \"{token_id}\", collection: \"{collection}\") {{success, message}} "

refresh_metadata()