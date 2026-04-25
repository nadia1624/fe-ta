import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Badge } from '../../../app/components/ui/badge';
import { Button } from '../../../app/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../app/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../app/components/ui/table';

describe('UI primitives', () => {
  it('renders badge variants including asChild', () => {
    const { rerender } = render(<Badge variant="success">Saved</Badge>);
    expect(screen.getByText('Saved')).toHaveAttribute('data-slot', 'badge');

    rerender(
      <MemoryRouter>
        <Badge asChild variant="warning">
          <a href="/warn">Warning</a>
        </Badge>
      </MemoryRouter>,
    );

    const warningLink = screen.getByRole('link', { name: 'Warning' });
    expect(warningLink).toHaveAttribute('data-slot', 'badge');
  });

  it('renders button variants, sizes, and asChild mode', () => {
    const { rerender } = render(
      <Button variant="outline" size="sm">
        Click
      </Button>,
    );
    expect(screen.getByRole('button', { name: 'Click' })).toHaveAttribute('data-slot', 'button');

    rerender(
      <MemoryRouter>
        <Button asChild variant="link" size="lg">
          <a href="/next">Next</a>
        </Button>
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute('data-slot', 'button');
  });

  it('renders all card slots', () => {
    render(
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
          <CardAction>Action</CardAction>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter className="border-t">Footer</CardFooter>
      </Card>,
    );

    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'card-description');
    expect(screen.getByText('Action')).toHaveAttribute('data-slot', 'card-action');
    expect(screen.getByText('Body')).toHaveAttribute('data-slot', 'card-content');
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  it('renders all table slots', () => {
    render(
      <Table>
        <TableCaption>Summary</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Column</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow data-state="selected">
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>,
    );

    expect(screen.getByText('Summary')).toHaveAttribute('data-slot', 'table-caption');
    expect(screen.getByText('Column')).toHaveAttribute('data-slot', 'table-head');
    expect(screen.getByText('Value')).toHaveAttribute('data-slot', 'table-cell');
    expect(screen.getByText('Total').closest('tfoot')).toHaveAttribute('data-slot', 'table-footer');
  });
});
