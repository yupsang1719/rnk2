export default function WorkFilters({ types, activeType, onTypeChange, sortOrder, onSortChange }) {
  return (
    <div className="work-filters">
      <div className="work-filters__pills" role="group" aria-label="Filter projects by type">
        {types.map((type) => (
          <button
            key={type}
            type="button"
            className={`work-filters__pill mono${type === activeType ? ' is-active' : ''}`}
            aria-pressed={type === activeType}
            onClick={() => onTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <label className="work-filters__sort-label mono">
        Sort
        <select
          className="work-filters__sort"
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="default">Default order</option>
          <option value="budget-asc">Budget: low to high</option>
          <option value="budget-desc">Budget: high to low</option>
        </select>
      </label>
    </div>
  )
}
