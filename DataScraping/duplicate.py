import pandas as pd
import argparse
from collections import Counter

def find_duplicates_advanced(csv_file, columns=None, show_stats=False, save_output=None):
    """
    Advanced duplicate finder with multiple options
    
    Args:
        csv_file: Path to CSV file
        columns: List of columns to check for duplicates (None = all columns)
        show_stats: Whether to show statistics
        save_output: File path to save duplicates (None = don't save)
    """
    try:
        # Read the CSV file - use the parameter instead of hardcoded filename
        df = pd.read_csv(csv_file, low_memory=False)

        print(f"Loaded CSV with {len(df)} rows and {len(df.columns)} columns")
        print(f"Columns: {list(df.columns)}")
        print("=" * 60)
        
        # Determine which columns to check
        if columns:
            # Check if specified columns exist
            missing_cols = [col for col in columns if col not in df.columns]
            if missing_cols:
                print(f"Warning: These columns don't exist: {missing_cols}")
                columns = [col for col in columns if col in df.columns]
            
            if not columns:
                print("No valid columns specified!")
                return
                
            subset_df = df[columns]
            print(f"Checking duplicates in columns: {columns}")
        else:
            subset_df = df
            columns = list(df.columns)
            print("Checking duplicates in ALL columns")
        
        # Find duplicates
        if len(columns) == len(df.columns):
            # Checking all columns
            duplicate_mask = df.duplicated(keep=False)
            duplicates = df[duplicate_mask]
        else:
            # Checking subset of columns
            duplicate_mask = df.duplicated(subset=columns, keep=False)
            duplicates = df[duplicate_mask]
        
        print("=" * 60)
        
        if duplicates.empty:
            print("✅ No duplicate rows found!")
            return
        
        # Show statistics
        if show_stats:
            # Count occurrences of each duplicate pattern
            if len(columns) == len(df.columns):
                duplicate_groups = df.groupby(list(df.columns)).size()
            else:
                duplicate_groups = df.groupby(columns).size()
            
            duplicate_counts = duplicate_groups[duplicate_groups > 1]
            
            print(f"📊 DUPLICATE STATISTICS:")
            print(f"   • Total duplicate rows: {len(duplicates)}")
            print(f"   • Unique duplicate patterns: {len(duplicate_counts)}")
            print(f"   • Original data: {len(df)} rows")
            print(f"   • After removing duplicates: {len(df.drop_duplicates(subset=columns))} rows")
            print("=" * 60)
        
        # Display duplicates (limit output for large datasets)
        print(f"🔍 FOUND {len(duplicates)} DUPLICATE ROWS:")
        print("=" * 60)
        
        # Group duplicates to show them together
        if len(columns) == len(df.columns):
            grouped = df.groupby(list(df.columns))
        else:
            grouped = df.groupby(columns)
        
        group_num = 1
        for name, group in grouped:
            if len(group) > 1:  # Only show groups with duplicates
                print(f"\n📌 Duplicate Group {group_num} ({len(group)} rows):")
                print("-" * 40)
                # Limit display to first 10 rows per group to avoid overwhelming output
                if len(group) > 10:
                    print(group.head(10).to_string(index=True))
                    print(f"... and {len(group) - 10} more rows")
                else:
                    print(group.to_string(index=True))
                group_num += 1
                
                # Stop after showing 5 groups to avoid overwhelming output
                if group_num > 5:
                    print(f"\n... and {len([g for n, g in grouped if len(g) > 1]) - 5} more duplicate groups")
                    break
        
        # Save to file if requested
        if save_output:
            duplicates.to_csv(save_output, index=False)
            print(f"\n💾 Duplicates saved to: {save_output}")
            
    except FileNotFoundError:
        print(f"❌ Error: File '{csv_file}' not found.")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Find duplicate rows in CSV files")
    parser.add_argument("csv_file", help="Path to the CSV file")
    parser.add_argument("-c", "--columns", nargs="+", 
                       help="Specific columns to check for duplicates")
    parser.add_argument("-s", "--stats", action="store_true",
                       help="Show duplicate statistics")
    parser.add_argument("-o", "--output", 
                       help="Save duplicates to this CSV file")
    
    args = parser.parse_args()
    
    find_duplicates_advanced(
        csv_file=args.csv_file,
        columns=args.columns,
        show_stats=args.stats,
        save_output=args.output
    )

if __name__ == "__main__":
    main()