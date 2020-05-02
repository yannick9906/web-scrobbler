'use strict';

require([
	'options/accounts',
	'options/dialogs',
	'options/options',
	'options/options.view',
	'bootstrap',
], (Accounts, Dialogs, OptionsPresenter, OptionsView) => {
	class OptionsViewImpl extends OptionsView {
		getPresenter() {
			return new OptionsPresenter(this);
		}
	}

	async function initialize() {
		await Promise.all([
			Accounts.initialize(),
			Dialogs.initialize(),
		]);

		new OptionsViewImpl();
	}

	initialize();
});
