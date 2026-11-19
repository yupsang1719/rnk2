export default function WorkFilters({ labels, types, activeType, onTypeChange, sortOrder, onSortChange, showSort = true }) {
  return (
    <div className="work-filters">
      {types.length > 0 && (
        <div className="work-filters__pills" role="group" aria-label="Filter projects by type">
          {[null, ...types].map((type) => (
            <button
              key={type ?? '__all'}
              type="button"
              className={`work-filters__pill mono${type === activeType ? ' is-active' : ''}`}
              aria-pressed={type === activeType}
              onClick={() => onTypeChange(type)}
            >
              {type ?? labels.filterAll}
            </button>
          ))}
        </div>
      )}

      {showSort && (
        <label className="work-filters__sort-label mono">
          {labels.sortLabel}
          <select
            className="work-filters__sort"
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="default">{labels.sortDefault}</option>
            <option value="budget-asc">{labels.sortAsc}</option>
            <option value="budget-desc">{labels.sortDesc}</option>
          </select>
        </label>
      )}
    </div>
  )
}
