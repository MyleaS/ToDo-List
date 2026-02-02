import { useState, useEffect } from "react";
import styled from "styled-components";

/* Styled components */
const StyledForm = styled.form``;

const StyledSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
`;

const StyledLabel = styled.label`
  padding: 4px;
`;

const StyledSelect = styled.select`
  padding: 4px;
`;

const StyledInput = styled.input`
  padding: 4px;
`;

const StyledButton = styled.button`
  padding: 4px 8px;

  &:disabled {
    font-style: italic;
  }
`;

function TodosViewForm({
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  queryString,
  setQueryString,
}) {
  // Local state for search input
  const [localQueryString, setLocalQueryString] = useState(queryString);

  const preventRefresh = (e) => {
    e.preventDefault();
  };

  // Debounce search input
  useEffect(() => {
    const debounce = setTimeout(() => {
      setQueryString(localQueryString);
    }, 500);

    return () => {
      clearTimeout(debounce);
    };
  }, [localQueryString, setQueryString]);

  return (
    <StyledForm onSubmit={preventRefresh}>
      <StyledSection>
        <StyledLabel htmlFor="sortField">Sort by</StyledLabel>
        <StyledSelect
          id="sortField"
          onChange={(e) => setSortField(e.target.value)}
          value={sortField}
        >
          <option value="title">Title</option>
          <option value="createdTime">Time added</option>
        </StyledSelect>

        <StyledLabel htmlFor="sortDirection">Direction</StyledLabel>
        <StyledSelect
          id="sortDirection"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </StyledSelect>
      </StyledSection>

      <StyledSection>
        <StyledLabel htmlFor="search">Search</StyledLabel>
        <StyledInput
          id="search"
          type="text"
          value={localQueryString}
          onChange={(e) => setLocalQueryString(e.target.value)}
        />
        <StyledButton type="button" onClick={() => setLocalQueryString("")}>
          Clear
        </StyledButton>
      </StyledSection>
    </StyledForm>
  );
}

export default TodosViewForm;
