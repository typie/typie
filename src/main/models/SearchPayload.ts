
export default class SearchPayload
{
    public type: string = 'fuzzy';   // can be 'fuzzy' | '' |
    public value: string = '';  // the actual search valu
    public orderBy: string = 'score'; // the name of the field to be ordered by
    public direction: string = 'desc';
    public packageName: string = '';
}
