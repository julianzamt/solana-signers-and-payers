use crate::{instructions::*};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    msg,
    program::invoke_signed,
    pubkey::Pubkey,
    rent::Rent,
    system_instruction::create_account,
    sysvar::Sysvar,
};

pub struct Processor;

impl Processor {
    pub fn process(
        program_id: &Pubkey,
        accounts: &[AccountInfo],
        instruction_data: &[u8],
    ) -> ProgramResult {
        let instruction = PayersInstruction::unpack(instruction_data)?;

        match instruction {
            PayersInstruction::CreatePDA {} => {
                Self::process_create_pda(accounts, program_id)?;
            }
        }

        Ok(())
    }

    pub fn process_create_pda(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_pda ix...");

        let account_info_iter = &mut accounts.iter();

        let first_pda = next_account_info(account_info_iter)?;
        let second_pda = next_account_info(account_info_iter)?;
        let first_creation_payer = next_account_info(account_info_iter)?;
        let second_creation_payer = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;
        
        let (_, bump) = Pubkey::find_program_address(&[b"first_pda", first_creation_payer.key.as_ref()], program_id);

        msg!("Creating first pda...");
        invoke_signed(
            &create_account(
                &first_creation_payer.key,
                &first_pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[first_creation_payer.clone(), first_pda.clone()],
            &[&[b"first_pda".as_ref(),  first_creation_payer.key.as_ref(), &[bump]]],
        )?;
        msg!("First pda creation succeded.");

        let (_, bump) = Pubkey::find_program_address(&[b"second_pda", second_creation_payer.key.as_ref()], program_id);

        msg!("Creating second pda...");
        invoke_signed(
            &create_account(
                &second_creation_payer.key,
                &second_pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[second_creation_payer.clone(), second_pda.clone()],
            &[&[b"second_pda".as_ref(), second_creation_payer.key.as_ref(), &[bump]]],
        )?;
        msg!("Second pda creation succeded.");

        Ok(())
    }
}
