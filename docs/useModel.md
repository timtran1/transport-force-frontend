# How to use the useModel hook


The `useModel` hook is a custom hook designed to handle CRUD operations for a specific model in your application. It provides a set of functions and state variables that you can use to interact with your backend API.

## Usage

First, import the hook:

```javascript
import useModel from '../../api/useModel';
```

Then, you can use it in your component:

```javascript
const { data } = useModel('modelName', { autoFetch: true });
```

Replace `'modelName'` with the name of the model you want to interact with, this should be the table name if using a Deepsel Python Template backend.


## Configuration

The `useModel` hook accepts two parameters: `modelName` and `options`.

```javascript
useModel(modelName, options = {})
```

### modelName

The `modelName` parameter is a string that represents the name of the model you want to interact with.

### options

The `options` parameter is an object that can have the following properties:

- `autoFetch`: A boolean indicating whether the hook should automatically fetch records when it mounts. This will also make the data be automatically re-fetched when filters, pagination, search...etc. information are updated. Defaults to `false`.
- `id`: The ID of a specific record. If provided and `autoFetch` is `true`, the hook will automatically fetch the record and set the `record` state variable as soon as it mounts.
- `page`: The initial page number. Defaults to `1`.
- `pageSize`: The initial page size. Defaults to `20`.
- `filters`: The initial [filters array](#the-filters-array). Defaults to an empty array `[]`.
- `orderBy`: The initial [order by field and direction](#order-by-field-and-direction). Defaults to `{field: 'id', direction: 'desc'}`.
- `searchFields`: An array of field names that should be included in the search when the `searchTerm` state variable is updated.

Here's an example of how to configure the `useModel` hook:

```javascript
const { data: invoices } = useModel('invoice', {
  autoFetch: true,
  page: 2,
  pageSize: 50,
  filters: [
      { field: 'status', operator: '=', value: 'active' },
      { field: 'amount', operator: '>', value: 100 }
  ],
  orderBy: { field: 'created_at', direction: 'desc' }
});
```

In the above example, the `useModel` hook is configured to automatically fetch invoices when the component mounts, and the data is assigned to the `invoices` variable.
It will fetch the second page of invoices, with a page size of 50, where `status` is `active` and `amount` is greater than 100. 
Records will be ordered by `created_at` in descending order.

### The filters array
The filter array is an array of objects, where each object represents a filter condition. Each object has the following properties:
- `field`: The field name to filter by. This can also be a field belonging to a relationship eg. `owner.name`
- `operator`: The operator to use for the filter. Supported operators are included in your `constants` folder (`ormOperators.js`). They will include:`=`, `!=`, `in`, `>`, `>=`, `<`, `<=`, `like`, `ilike`
- `value`: The value to filter by. This can be a string, number, boolean, ISO date string, or array of values, depending on the operator.


### Order by field and direction
The `orderBy` property is an object with two properties:
- `field`: The field name to order by.
- `direction`: The direction to order by. Supported directions are `asc` and `desc`.

## Hook Exports

The `useModel` hook returns an object with the following properties:

### Fetch results

- `data`: An array of records retrieved from the backend.
- `record`: A single record retrieved from the backend.

### CRUD methods
- `get`: A function to fetch multiple records. Filters, pagination, and sorting can be applied by setting the [query states](#query-states) below. Returns an array of records and also sets the `data` state.
- `getOne`: A function to fetch a single record by its ID, and also sets the `record` state. Takes an ID as an argument.
- `create`: A function to create a new record. Returns the created record, and also append it into the `data` array.
- `update`: A function to update an existing record, and also update the `data` array with the updated record. Takes the updated record object as an argument.
- `del`: A function to delete a record by its ID, and also remove it from the `data` array. Takes an ID as an argument.
- `deleteWithConfirm`: A function to delete one or more records with a confirmation prompt. Takes an array of IDs as an argument.

### Query states

- `page`: The current page number used for pagination. Default is 1. When updated, records will be re-fetched and updated in the `data` state automatically.
- `setPage`: A function to change the current page number. Takes an integer as an argument.
- `pageSize`: The current page size for pagination. Default is 20. When updated, records will be re-fetched and updated in the `data` state automatically.
- `setPageSize`: A function to change the current page size. Takes an integer as an argument.
- `total`: The total number of records, regardless of pagination. Read-only.
- `query`: The current query object for filtering and sorting.
- `setQuery`: A function to change the current query object.
- `filters`: The current filters applied to the query. When updated, records will be re-fetched and updated in the `data` state automatically.
- `setFilters`: A function to change the current filters.
- `searchTerm`: The current search term. When updated, records will be searched by the fields specified in the `searchFields` option and updated in the `data` state automatically.
- `setSearchTerm`: A function to change the current search term. Takes a string as an argument.
- `orderBy`: The current order by field and direction. Takes a [order by field and direction](#order-by-field-and-direction) object as an argument.
- `setOrderBy`: A function to change the order by field and direction. Takes a [order by field and direction](#order-by-field-and-direction) object as an argument.

### Loading and error handling

- `loading`: A boolean indicating whether a request is currently in progress.
- `error`: A string containing an error message or `null`, if no error occurred.



## Examples

Here's an example of how you might use the `useModel` hook to display a list of records:

```javascript
import useModel from './path/to/useModel';

function MyComponent() {
    const { data, get } = useModel('modelName');

    // Fetch data when the component mounts
    useEffect(() => {
        get();
    }, []);

    // render the data
    return (
        <div>
        {data.map(record => (
            <div key={record.id}>{record.name}</div>
        ))}
        </div>
    );
}
```


### Fetch Multiple Records

The `get` function is used to fetch multiple records. Here's an example of how to use it:

```javascript
// Fetch data when the component mounts
useEffect(() => {
  get();
}, []);
```

In this example, the `get` function is called when the component mounts, fetching the records from the backend.

### Fetch a Single Record

The `getOne` function is used to fetch a single record by its ID. Here's an example of how to use it:

```javascript
import useModel from './path/to/useModel';

function MyComponent() {
    const { record, getOne } = useModel('modelName');

    // Fetch record with ID 1 when the component mounts
    useEffect(() => {
        getOne(1);
    }, []);

    // render it
    return (
        <div>
            {record.name}
        </div>
    );
}
```

In this example, replace `id` with the ID of the record you want to fetch.

### Create a New Record

The `create` function is used to create a new record. Here's an example of how to use it:

```javascript
const { create } = useModel('modelName');

async function myFunc() {
    const record = await create({ field1: 'value1', field2: 'value2' });
    console.log(record);
}
```

In this example, replace `field1` and `field2` with the actual field names for your model, and `value1` and `value2` with the values you want to set for those fields.

### Update an Existing Record

The `update` function is used to update an existing record. Here's an example of how to use it:

```javascript
const { update } = useModel('modelName');

async function myFunc() {
    const updatedRecord = await update({ id: id, field1: 'new value1', field2: 'new value2' });
    console.log(updatedRecord);
}
```

In this example, replace `id` with the ID of the record you want to update, and `field1` and `field2` with the actual field names for your model. Replace `new value1` and `new value2` with the new values you want to set for those fields.

### Delete a Record

The `del` function is used to delete a record by its ID. Here's an example of how to use it:

```javascript
const { del } = useModel('modelName');o

async function myFunc() {
    // Delete record with ID 1
    await del(1);
}
```

In this example, replace `id` with the ID of the record you want to delete.

### Change the Current Page Number

The `setPage` function is used to change the current page number. Here's an example of how to use it:

```javascript
// Change the current page number
setPage(2);
```

In this example, replace `2` with the page number you want to navigate to.

### Change the Current Page Size

The `setPageSize` function is used to change the current page size. Here's an example of how to use it:

```javascript
// Change the current page size
setPageSize(50);
```

In this example, replace `50` with the page size you want to set.


### Change the Current Search Term

The `setSearchTerm` function is used to change the current search term. Here's an example of how to use it:

```javascript
// Change the current search term
setSearchTerm('ice cream');
```

The `data` state will be updated automatically with the records that match the new search term, based on the fields specified in the `searchFields` option.
For example, if you have configured the `searchFields: ['name', 'description']`, the `data` state will be updated with records that have `ice cream` in either the `name` or `description` fields.
