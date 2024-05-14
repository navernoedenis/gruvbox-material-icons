import { fileIcons } from './../../icons/fileIcons';
import { folderIcons } from './../../icons/folderIcons';
import { languageIcons } from './../../icons/languageIcons';
import { generatePreview } from './preview';
import { FolderType } from '../../models';

const filterDuplicates = (icons: string[]) => {
  return [...new Set(icons)];
};

const basicFileIcons = filterDuplicates(
  fileIcons.icons
    // remove icons that are clones
    .filter((i) => i.clone === undefined)
    .map((i) => i.name)
    // merge language icons
    .concat(languageIcons.map((i) => i.icon.name))
).map((i) => ({ iconName: i, label: i }));

const folderTheme = (type: FolderType) => {
  let foldername = 'folder-';
  let regex = new RegExp(foldername, 'gi');

  if (type === 'colorful') {
    foldername = 'colorful-folder-';
    regex = new RegExp(foldername, 'gi');
  }

  return filterDuplicates(
    folderIcons
      .map((theme) => {
        const folders = [];
        if (theme.icons && theme.icons.length > 0) {
          folders.push(
            ...theme.icons
              // remove icons that are clones
              .filter((i) => i.clone === undefined)
              .filter((i) => i.name.startsWith(foldername))
              .map((i) => i.name)
          );
        }
        return [...folders];
      })
      .reduce((a, b) => a.concat(b))
  ).map((i) => ({ iconName: i, label: i.replace(regex, '') }));
};

const columnsOnScreen = 5;

generatePreview('fileIcons', basicFileIcons, columnsOnScreen, [
  'virtual',
  'powerpoint',
  'word',
  'credits',
]);

generatePreview(
  'folderIcons-specific',
  folderTheme('specific'),
  columnsOnScreen,
  ['folder-aurelia', 'folder-phpmailer', 'folder-syntax', 'folder-ansible']
);

generatePreview(
  'folderIcons-colorful',
  folderTheme('colorful'),
  columnsOnScreen,
  ['folder-aurelia', 'folder-phpmailer', 'folder-syntax', 'folder-ansible']
);
