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
            PayersInstruction::CreatePDAWithSystemAccNotFeePayer {} => {
                Self::process_create_pda_with_system_acc_not_fee_payer(accounts, program_id)?;
            },
            PayersInstruction::CreatePDAWithOwnedAcc {} => {
                Self::process_create_pda_with_owned_acc(accounts, program_id)?;
            }
        }

        Ok(())
    }

    pub fn process_create_pda_with_system_acc_not_fee_payer(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_pda_with_system_acc_not_fee_payer ix...");

        let account_info_iter = &mut accounts.iter();

        let pda = next_account_info(account_info_iter)?;
        let creation_payer = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;
        
        let (_, bump) = Pubkey::find_program_address(&[b"pda_sys_acc", creation_payer.key.as_ref()], program_id);

        msg!("Creating pda with system account not fee payer...");
        invoke_signed(
            &create_account(
                &creation_payer.key,
                &pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[creation_payer.clone(), pda.clone()],
            &[&[b"pda_sys_acc".as_ref(),  creation_payer.key.as_ref(), &[bump]]],
        )?;
        msg!("Pda creation with system account not fee payer succeded.");

        Ok(())
    }

    pub fn process_create_pda_with_owned_acc(accounts: &[AccountInfo], program_id: &Pubkey) -> ProgramResult {
        msg!("process_create_pda_with_owned_acc ix...");

        let account_info_iter = &mut accounts.iter();

        let pda = next_account_info(account_info_iter)?;
        let creation_payer = next_account_info(account_info_iter)?;
        let _system_program = next_account_info(account_info_iter)?;

        let rent = Rent::get()?;
        let rent_minimum_balance = rent.minimum_balance(8);
        
        let space = 8;
        

        let (_, bump) = Pubkey::find_program_address(&[b"pda_owned_acc", creation_payer.key.as_ref()], program_id);

        msg!("Creating pda with owned account...");
        invoke_signed(
            &create_account(
                &creation_payer.key,
                &pda.key,
                rent_minimum_balance,
                space as u64,
                program_id,
            ),
            &[creation_payer.clone(), pda.clone()],
            &[&[b"pda_owned_acc".as_ref(), creation_payer.key.as_ref(), &[bump]]],
        )?;
        msg!("Pda creation with owned account succeded.");

        Ok(())
    }
}
