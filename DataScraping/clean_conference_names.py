import pandas as pd
import argparse
import re

def clean_conference_names(csv_file, output_file=None, preview_only=False):
    """
    Clean conference names by removing '2024-2025 Men's' prefix.
    If the result would be empty, replace with 'CUSA'.
    
    Args:
        csv_file: Path to input CSV file
        output_file: Path to save cleaned CSV (None = overwrite original)
        preview_only: If True, only show changes without saving
    """
    try:
        # Read the CSV file
        df = pd.read_csv(csv_file, low_memory=False)
        print(f"Loaded CSV with {len(df)} rows and {len(df.columns)} columns")
        
        # Check if Conference column exists
        if 'Conference' not in df.columns:
            print("❌ Error: 'Conference' column not found in the CSV file")
            print(f"Available columns: {list(df.columns)}")
            return
        
        # Add this right after reading the CSV to see what we're dealing with
        print(f"\n🔍 ANALYZING CONFERENCE NAMES:")
        print("-" * 50)
        unique_conferences = df['Conference'].unique()
        for conf in unique_conferences:
            if '2024' in str(conf):
                print(f"'{conf}' (length: {len(str(conf))}, repr: {repr(conf)})")
        
        # Create a copy for comparison
        original_conferences = df['Conference'].copy()
        
        # Clean the conference names
        def clean_conference(conf_name):
            if pd.isna(conf_name):
                return conf_name
            
            # Convert to string if not already
            conf_str = str(conf_name)
            
            # Use regex to remove the pattern more reliably
            # This matches "2024-25 Men's" or "2024-2025 Men's" followed by optional space and text
            pattern = r'^2024-2?5 Men\'s\s*(.*)$'
            match = re.match(pattern, conf_str)
            
            if match:
                # Get what comes after the prefix
                remainder = match.group(1).strip()
                
                # If nothing remains, it's the CUSA conference
                if not remainder:
                    return 'Conference USA'
                else:
                    return remainder
            
            # If no pattern matched, return original
            return conf_str
        
        # Apply the cleaning function
        df['Conference'] = df['Conference'].apply(clean_conference)
        
        # Show changes
        changes = original_conferences != df['Conference']
        num_changes = changes.sum()
        
        print(f"\n📊 CLEANING RESULTS:")
        print(f"   • Total rows processed: {len(df)}")
        print(f"   • Rows changed: {num_changes}")
        print(f"   • Rows unchanged: {len(df) - num_changes}")
        
        if num_changes > 0:
            print(f"\n🔄 CHANGES MADE:")
            print("=" * 80)
            
            # Show unique changes
            changed_df = pd.DataFrame({
                'Original': original_conferences[changes],
                'Cleaned': df['Conference'][changes]
            })
            
            # Group by unique transformations
            unique_changes = changed_df.drop_duplicates()
            
            for idx, row in unique_changes.iterrows():
                count = ((original_conferences == row['Original']) & 
                        (df['Conference'] == row['Cleaned'])).sum()
                print(f"'{row['Original']}' → '{row['Cleaned']}' ({count} rows)")
            
            # Show sample of affected rows
            print(f"\n📋 SAMPLE OF CHANGED ROWS:")
            print("-" * 80)
            sample_changes = df[changes].head(10)[['Player', 'School', 'Conference']] if 'Player' in df.columns and 'School' in df.columns else df[changes].head(10)
            print(sample_changes.to_string(index=False))
            
            if changes.sum() > 10:
                print(f"... and {changes.sum() - 10} more changed rows")
        
        # Preview unique conference names after cleaning
        print(f"\n📝 UNIQUE CONFERENCE NAMES AFTER CLEANING:")
        print("-" * 50)
        unique_conferences = sorted(df['Conference'].unique())
        for i, conf in enumerate(unique_conferences, 1):
            count = (df['Conference'] == conf).sum()
            print(f"{i:2d}. {conf} ({count} rows)")
        
        # Save the file if not preview only
        if not preview_only:
            output_path = output_file if output_file else csv_file
            df.to_csv(output_path, index=False)
            print(f"\n✅ Cleaned data saved to: {output_path}")
        else:
            print(f"\n👀 PREVIEW MODE: No changes saved")
            print(f"   To save changes, run without --preview flag")
            
    except FileNotFoundError:
        print(f"❌ Error: File '{csv_file}' not found.")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="Clean conference names in NCAA stats CSV")
    parser.add_argument("csv_file", help="Path to the CSV file")
    parser.add_argument("-o", "--output", 
                       help="Output file path (default: overwrite original)")
    parser.add_argument("-p", "--preview", action="store_true",
                       help="Preview changes without saving")
    
    args = parser.parse_args()
    
    clean_conference_names(
        csv_file=args.csv_file,
        output_file=args.output,
        preview_only=args.preview
    )

if __name__ == "__main__":
    main()